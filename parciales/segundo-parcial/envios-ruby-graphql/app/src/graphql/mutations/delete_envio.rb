require_relative "../../models/envio"

module Mutations
  class DeleteEnvio < BaseMutation
    description "Elimina un envío"
    argument :id, ID, required: true

    field :ok, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      envio = Envio[id.to_i]
      raise "Not found" unless envio
      envio.delete
      { ok: true, errors: [] }
    rescue => e
      { ok: false, errors: [e.message] }
    end
  end
end
