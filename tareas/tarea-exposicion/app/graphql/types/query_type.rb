module Types
  class QueryType < Types::BaseObject
    field :alumnos, [Types::AlumnoType], null: false
    field :alumno, Types::AlumnoType, null: true do
      argument :id, ID, required: true
    end

    def alumnos
      ::Alumno.all
    end

    def alumno(id:)
      ::Alumno.find_by(id: id)
    end
  end
end
