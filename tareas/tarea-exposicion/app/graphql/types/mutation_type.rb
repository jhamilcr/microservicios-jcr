module Types
  class MutationType < Types::BaseObject
    field :create_alumno, Types::AlumnoType, null: false do
      argument :nombres, String, required: false
      argument :apellidos, String, required: false
      argument :cu, String, required: true
      argument :carrera, String, required: false
    end
    def create_alumno(nombres: nil, apellidos: nil, cu:, carrera: nil)
      ::Alumno.create!(nombres: nombres, apellidos: apellidos, cu: cu, carrera: carrera)
    end

    field :update_alumno, Types::AlumnoType, null: true do
      argument :id, ID, required: true
      argument :nombres, String, required: false
      argument :apellidos, String, required: false
      argument :cu, String, required: false
      argument :carrera, String, required: false
    end
    def update_alumno(id:, **attrs)
      a = ::Alumno.find_by(id: id)
      return nil unless a
      a.update!(attrs.compact)
      a
    end

    field :delete_alumno, Boolean, null: false do
      argument :id, ID, required: true
    end
    def delete_alumno(id:)
      a = ::Alumno.find_by(id: id)
      a&.destroy!
      !!a
    end
  end
end
