#!/usr/bin/env bash
set -Eeuo pipefail

# ========= Ajustes globales =========
export RAILS_ENV="${RAILS_ENV:-development}"

wait_for_db() {
  echo ">> Esperando a Postgres en ${DB_HOST:-db}:5432 ..."
  until (echo >/dev/tcp/${DB_HOST:-db}/5432) >/dev/null 2>&1; do
    sleep 0.5
  done
}

# ========= Bootstrap de proyecto =========
if [ ! -f "Gemfile" ]; then
  echo ">> Inicializando proyecto Rails..."
  rails new . \
    --force \
    --skip-action-mailer \
    --skip-action-mailbox \
    --skip-action-text \
    --skip-active-storage \
    --skip-test \
    --skip-system-test \
    --skip-jbuilder \
    --skip-hotwire \
    --skip-javascript \
    --database=postgresql
fi

# Gems GraphQL + GraphiQL (solo dev) + listen para hot-reload en Linux
if ! grep -q "gem 'graphql'" Gemfile; then
  cat >> Gemfile <<'GEMS'
gem 'graphql', '~> 2.3'
group :development do
  gem 'graphiql-rails'
  gem 'listen', '~> 3.8'
end
GEMS
fi

bundle install

# ========= DB config =========
DBYML=config/database.yml
if ! grep -q "alumnos_development" "$DBYML" 2>/dev/null; then
  echo ">> Escribiendo config/database.yml"
  cat > "$DBYML" <<YML
default: &default
  adapter: postgresql
  encoding: unicode
  pool: 10
  host: <%= ENV.fetch("DB_HOST") %>
  username: <%= ENV.fetch("DB_USERNAME") %>
  password: <%= ENV.fetch("DB_PASSWORD") %>

development:
  <<: *default
  database: <%= ENV.fetch("DB_NAME") %>
YML
fi

# ========= Instalar GraphQL (si no existe) =========
if [ ! -d "app/graphql" ]; then
  echo ">> Instalando GraphQL..."
  bundle exec rails generate graphql:install
fi

# ========= Modelo Alumno =========
if [ ! -f "app/models/alumno.rb" ]; then
  echo ">> Generando modelo Alumno..."
  bundle exec rails generate model Alumno nombres:string apellidos:string cu:string:uniq carrera:string
fi

# ========= Type + Query/Mutations =========
if [ ! -f "app/graphql/types/alumno_type.rb" ]; then
  bundle exec rails generate graphql:object Alumno
fi

ruby <<'RUBY'
# ----- AlumnoType -----
path = "app/graphql/types/alumno_type.rb"
if File.exist?(path)
  s = File.read(path)
  unless s.include?("field :id")
    s.sub!("class Types::AlumnoType < Types::BaseObject\n",
      "class Types::AlumnoType < Types::BaseObject\n  field :id, ID, null: false\n  field :nombres, String, null: true\n  field :apellidos, String, null: true\n  field :cu, String, null: true\n  field :carrera, String, null: true\n  field :created_at, GraphQL::Types::ISO8601DateTime, null: false\n  field :updated_at, GraphQL::Types::ISO8601DateTime, null: false\n")
    File.write(path, s)
  end
end

# ----- QueryType -----
qpath = "app/graphql/types/query_type.rb"
if File.exist?(qpath)
  q = File.read(qpath)
  unless q.include?("field :alumnos")
    q.sub!("class Types::QueryType < Types::BaseObject\n",
      "class Types::QueryType < Types::BaseObject\n  field :alumnos, [Types::AlumnoType], null: false\n  field :alumno, Types::AlumnoType, null: true do\n    argument :id, ID, required: true\n  end\n\n  def alumnos\n    ::Alumno.all\n  end\n\n  def alumno(id:)\n    ::Alumno.find_by(id: id)\n  end\n")
    File.write(qpath, q)
  end
end

# ----- MutationType -----
mpath = "app/graphql/types/mutation_type.rb"
if File.exist?(mpath)
  m = File.read(mpath)
  unless m.include?("create_alumno")
    m.sub!("class Types::MutationType < Types::BaseObject\n",
      "class Types::MutationType < Types::BaseObject\n  field :create_alumno, Types::AlumnoType, null: false do\n    argument :nombres, String, required: false\n    argument :apellidos, String, required: false\n    argument :cu, String, required: true\n    argument :carrera, String, required: false\n  end\n\n  field :update_alumno, Types::AlumnoType, null: true do\n    argument :id, ID, required: true\n    argument :nombres, String, required: false\n    argument :apellidos, String, required: false\n    argument :cu, String, required: false\n    argument :carrera, String, required: false\n  end\n\n  field :delete_alumno, Boolean, null: false do\n    argument :id, ID, required: true\n  end\n\n  def create_alumno(nombres: nil, apellidos: nil, cu:, carrera: nil)\n    ::Alumno.create!(nombres: nombres, apellidos: apellidos, cu: cu, carrera: carrera)\n  end\n\n  def update_alumno(id:, **attrs)\n    a = ::Alumno.find_by(id: id)\n    return nil unless a\n    a.update!(attrs.compact)\n    a\n  end\n\n  def delete_alumno(id:)\n    a = ::Alumno.find_by(id: id)\n    a&.destroy!\n    !!a\n  end\n")
    File.write(mpath, m)
  end
end

# ----- Schema: asegurar query(...) y mutation(...) -----
schema_path = Dir['app/graphql/*_schema.rb'].first
if schema_path && File.exist?(schema_path)
  s = File.read(schema_path); changed = false
  unless s.include?('query(Types::QueryType)')
    s.sub!(/class .*Schema < GraphQL::Schema\n/, "\\0  query(Types::QueryType)\n"); changed = true
  end
  unless s.include?('mutation(Types::MutationType)')
    s.sub!(/class .*Schema < GraphQL::Schema\n/, "\\0  mutation(Types::MutationType)\n"); changed = true
  end
  File.write(schema_path, s) if changed
end
RUBY

# ========= Rutas + GraphiQL =========
routes=config/routes.rb
grep -q 'post "/graphql"' "$routes" || echo 'post "/graphql", to: "graphql#execute"' >> "$routes"
if ! grep -q "mount GraphiQL::Rails::Engine" "$routes"; then
  {
    echo 'if Rails.env.development?'
    echo '  mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"'
    echo 'end'
  } >> "$routes"
fi

# (Opcional) Assets de GraphiQL por si un día levantas en production
if [ -f "app/assets/config/manifest.js" ] && ! grep -q "graphiql/rails/application.js" app/assets/config/manifest.js; then
  echo "//= link graphiql/rails/application.css" >> app/assets/config/manifest.js
  echo "//= link graphiql/rails/application.js"  >> app/assets/config/manifest.js
fi

# ========= Desactivar CSRF en GraphQL (para clientes como Postman) =========
gctrl="app/controllers/graphql_controller.rb"
if [ -f "$gctrl" ] && ! grep -q "skip_before_action :verify_authenticity_token" "$gctrl"; then
  echo ">> Parcheando GraphqlController para CSRF"
  ruby - <<'RUBY'
p = "app/controllers/graphql_controller.rb"
s = File.read(p)
s.sub!("class GraphqlController < ApplicationController",
       "class GraphqlController < ApplicationController\n  skip_before_action :verify_authenticity_token\n")
unless s.include?("def prepare_variables")
  s << %q{

  private

  def prepare_variables(variables_param)
    case variables_param
    when String
      variables_param.present? ? JSON.parse(variables_param) : {}
    when Hash
      variables_param
    when ActionController::Parameters
      variables_param.to_unsafe_hash
    else
      {}
    end
  end
}
end
File.write(p, s)
RUBY
fi

wait_for_db

echo ">> Preparando base de datos..."
bundle exec rails db:prepare

# (Opcional) Seeds iniciales solo si no hay registros
ruby -e 'begin; require "./config/environment"; if Alumno.count==0; Alumno.create!(cu:"20250001",nombres:"Ana",apellidos:"Pérez",carrera:"Sistemas"); puts ">> Seed: 1 alumno creado"; end; rescue => e; warn e.message; end'

echo ">> Iniciando servidor..."
exec "$@"
