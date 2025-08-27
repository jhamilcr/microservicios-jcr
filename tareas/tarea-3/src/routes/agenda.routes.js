import { Router } from "express";

import Agenda from "../models/Agenda.js";

const router = Router();

router.post('/', async (req, res) => {
  try {
    const agenda =  await Agenda.create(req.body);
    res.status(201).json(agenda);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (_req, res) => {
  const agendas = await Agenda.find();
  res.json(agendas);
});

router.get('/:id', async (req, res) => {
  try {
    const agenda = await Agenda.findById(req.params.id);
    if (!agenda) return res.status(404).json({ error: 'No encontrada' });
    res.json(agenda);
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const agenda = await Agenda.findByIdAndUpdate(
      req.params.id,
      re.body,
      { new: true, runValidators: true }
    );

    if (!agenda) return re.status(404).json({ error: 'No encontrada' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const agenda = await Agenda.findByIdAndDelete(req.params.id);
    if (!agenda) return res.status(404).json({ error: 'No encontrada' });
    res.status(204).send();
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});

export default router;