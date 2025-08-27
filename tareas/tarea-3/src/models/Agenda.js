import mongoose from "mongoose";

const agendaSchema = new mongoose.Schema(
  {
    nombres: { type: String , requiered: true, trim: true},
    apellidos: { type: String, trim: true },
    fecha_nacimiento: { type: Date },
    direccion: { type: String },
    celular: { type: Number },
    correo: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Agenda', agendaSchema);