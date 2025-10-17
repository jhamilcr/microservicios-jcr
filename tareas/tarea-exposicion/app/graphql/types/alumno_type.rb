module Types
  class AlumnoType < Types::BaseObject
    field :id, ID, null: false
    field :nombres, String, null: true
    field :apellidos, String, null: true
    field :cu, String, null: true
    field :carrera, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
