class CreateAlumnos < ActiveRecord::Migration[7.2]
  def change
    create_table :alumnos do |t|
      t.string :nombres
      t.string :apellidos
      t.string :cu
      t.string :carrera

      t.timestamps
    end
    add_index :alumnos, :cu, unique: true
  end
end
