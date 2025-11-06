require_relative "../../models/envio"

module Mutations
  class CreateEnvio < BaseMutation
    description "Crea un envío"
    argument :usuario_id, Integer, required: true
    argument :vehiculo_id, Integer, required: true
    argument :origen, String, required: true

    field :envio, Types::EnvioType, null: true
    field :errors, [String], null: false

    def resolve(usuario_id:, vehiculo_id:, origen:)
      envio = Envio.create(
        usuario_id: usuario_id,
        vehiculo_id: vehiculo_id,
        origen: origen
      )
      { envio: envio, errors: [] }
    rescue => e
      { envio: nil, errors: [e.message] }
    end
  end
end
