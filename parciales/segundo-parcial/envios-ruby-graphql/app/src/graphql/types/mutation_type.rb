# Carga explícita de mutations
require_relative "../mutations/base_mutation"
require_relative "../mutations/create_envio"
require_relative "../mutations/update_envio"
require_relative "../mutations/delete_envio"

module Types
  class MutationType < Types::BaseObject
    description "Root Mutation"

    field :create_envio, mutation: Mutations::CreateEnvio
    field :update_envio, mutation: Mutations::UpdateEnvio
    field :delete_envio, mutation: Mutations::DeleteEnvio
  end
end
