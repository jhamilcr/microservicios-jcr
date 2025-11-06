import { Router } from "express";
import { Item } from "../models/Item.js";
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /items
router.get("/", requireAuth, async (_req, res) => {
  const rows = await Item.find({}).sort({ _id: 1 });
  res.json(rows);
});

// GET /items/:id
router.get("/:id", requireAuth, async (req, res) => {
  const row = await Item.findById(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });
  res.json(row);
});

// POST /items
router.post("/", requireAuth, async (req, res) => {
  const { placa, tipo, capacidad, estado } = req.body || {};
  if (!placa) return res.status(400).json({ message: "Placa is required" });
  const created = await Item.create({ placa, tipo, capacidad, estado });
  res.status(201).json(created);
});

// PUT /items/:id
router.put("/:id", requireAuth, async (req, res) => {
  const { placa, tipo, capacidad, estado } = req.body || {};
  const updated = await Item.findByIdAndUpdate(
    req.params.id,
    { placa, tipo, capacidad, estado },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
});

// DELETE /items/:id
router.delete("/:id", requireAuth, async (req, res) => {
  const deleted = await Item.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.status(204).send();
});

export default router;