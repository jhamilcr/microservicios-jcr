require_relative "../../models/envio"

module Mutations
  class UpdateEnvio < BaseMutation
    description "Actualiza un envío"
    argument :id, ID, required: true
    argument :usuario_id, Integer, required: false
    argument :vehiculo_id, Integer, required: false
    argument :origen, String, required: false

    field :envio, Types::EnvioType, null: true
    field :errors, [String], null: false

    def resolve(id:, usuario_id: nil, vehiculo_id: nil, origen: nil)
      envio = Envio[id.to_i]
      raise "Not found" unless envio

      envio.update(
        usuario_id: usuario_id || envio.usuario_id,
        vehiculo_id: vehiculo_id || envio.vehiculo_id,
        origen: origen.nil? ? envio.origen : origen
      )
      { envio: envio, errors: [] }
    rescue => e
      { envio: nil, errors: [e.message] }
    end
  end
end
