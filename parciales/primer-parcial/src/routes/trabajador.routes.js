import { Router } from "express";

import Trabajador from "../models/Trabajador.js";

const router = Router();

router.post('/', async (req, res) => {
  try {
    const trabajador =  await Trabajador.create(req.body);
    res.status(201).json(trabajador);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (_req, res) => {
  const trabajadores = await Trabajador.find();
  res.json(trabajadores);
});

router.get('/:id', async (req, res) => {
  try {
    const trabajador = await Trabajador.findById(req.params.id);
    if (!trabajador) return res.status(404).json({ error: 'No encontrado' });
    res.json(trabajador);
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const trabajador = await Trabajador.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!trabajador) return re.status(404).json({ error: 'No encontrado' });
    res.json(trabajador);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const trabajador = await Trabajador.findByIdAndDelete(req.params.id);
    if (!trabajador) return res.status(404).json({ error: 'No encontrada' });
    res.status(204).send();
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});

export default router;