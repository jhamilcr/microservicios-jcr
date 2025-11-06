import mongoose from "mongoose";

const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB,
  MONGO_USER,
  MONGO_PASS,
  NODE_ENV
} = process.env;

const uri = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

export async function connectMongo() {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    if (NODE_ENV === "development") {
      console.log("✅ Conectado a MongoDB");
    }
  } catch (err) {
    console.error("❌ Error de conexión a MongoDB:", err.message);
    process.exit(1);
  }
}