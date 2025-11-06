import "dotenv/config.js";
import express from "express";
import { connectMongo } from "./db.js";
import itemsRouter from "./routes/items.js";

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());

// Healthcheck
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Rutas
app.use("/vehiculos", itemsRouter);

app.listen(port, async () => {
  await connectMongo();
  console.log(`🚀 API escuchando en http://localhost:${port}`);
});