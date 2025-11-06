require "sinatra/base"
require "json"
require "rack/cors"
require "rack/protection"

require_relative "./db"
require_relative "./graphql/schema"

class App < Sinatra::Base
  configure do
    set :show_exceptions, false
    use Rack::Protection
    use Rack::Cors do
      allow do
        origins "*"
        resource "*", headers: :any, methods: [:get, :post, :options]
      end
    end
  end

  # Health
  get "/health" do
    content_type :json
    { status: "ok" }.to_json
  end

  # GraphQL endpoint
  post "/graphql" do
    content_type :json
    body = request.body.read
    params = body && body.size > 0 ? JSON.parse(body) : {}

    result = AppSchema.execute(
      params["query"],
      variables: params["variables"],
      operation_name: params["operationName"],
      context: {}
    )
    result.to_json
  end

  # GraphiQL (playground) — usa assets desde CDN
  get "/graphiql" do
    content_type :html
    <<-HTML
<!DOCTYPE html>
<html>
  <head>
    <title>GraphiQL</title>
    <link rel="stylesheet" href="https://unpkg.com/graphiql/graphiql.min.css" />
    <style>html,body,#graphiql{height:100%;margin:0;width:100%;}</style>
  </head>
  <body>
    <div id="graphiql">Loading...</div>
    <script src="https://unpkg.com/react/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/graphiql/graphiql.min.js"></script>
    <script>
      const fetcher = graphQLParams =>
        fetch('/graphql', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(graphQLParams),
        }).then(response => response.json());
      ReactDOM.render(
        React.createElement(GraphiQL, { fetcher }),
        document.getElementById('graphiql'),
      );
    </script>
  </body>
</html>
    HTML
  end

  # errores
  error do
    e = env["sinatra.error"]
    content_type :json
    status 500
    { error: e.class.name, message: e.message }.to_json
  end

  not_found do
    content_type :json
    { message: "Not found" }.to_json
  end
end