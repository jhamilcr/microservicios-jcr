require_relative "../../models/envio"

module Types
  class QueryType < Types::BaseObject
    description "Root Query"

    field :envios, [Types::EnvioType], null: false do
      description "Lista todos los envíos"
    end

    field :envio, Types::EnvioType, null: true do
      description "Obtiene un envío por ID"
      argument :id, ID, required: true
    end

    def envios
      Envio.order(:id).all
    end

    def envio(id:)
      Envio[id.to_i]
    end
  end
end
