require "graphql"

require_relative "./types/base_object"
require_relative "./types/base_input_object"
require_relative "./types/envio_type"
require_relative "./types/query_type"
require_relative "./mutations/base_mutation"
require_relative "./mutations/create_envio"
require_relative "./mutations/update_envio"
require_relative "./mutations/delete_envio"
require_relative "./types/mutation_type"

class AppSchema < GraphQL::Schema
  query Types::QueryType
  mutation Types::MutationType
end
