import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    placa: { type: String, required: true},
    tipo: { type: String, default: null },
    capacidad: { type: Number, required: true, default: 0 },
    estado: { type: String, default: null },
  },
  { timestamps: true } // createdAt / updatedAt automáticos
);

export const Item = mongoose.model("Vehiculo", ItemSchema);