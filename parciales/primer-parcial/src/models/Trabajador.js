import mongoose from "mongoose";

const trabajadorSchema = new mongoose.Schema(
  {
    nombre: { type: String , requiered: true, trim: true},
    apellido: { type: String, trim: true },
    ci: { type: Number },
    cargo: { type: String },
    departamento: { type: String },
    fechaIngreso: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('Trabajador', trabajadorSchema);