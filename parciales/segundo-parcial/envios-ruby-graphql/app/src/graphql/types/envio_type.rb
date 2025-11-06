module Types
  class EnvioType < Types::BaseObject
    description "Envío"

    field :id, ID, null: false
    field :usuario_id, Integer, null: false
    field :vehiculo_id, Integer, null: false
    field :origen, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
