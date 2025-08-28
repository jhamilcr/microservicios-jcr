require("dotenv").config();
const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("Falta MONGO_URI en .env");

  try {
    await mongoose.connect(uri);
    console.log("MongoDB conectado");
    return;
  } catch (err) {
    throw new Error("No se pudo conectar a MongoDB tras varios intentos");
  }
  
}

module.exports = { connectDB };
