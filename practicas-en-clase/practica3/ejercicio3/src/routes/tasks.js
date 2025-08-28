const { Router } = require('express');
const Task = require('../models/Task');
const router = Router();

router.get('/', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 }).lean();
  res.render('tasks/index', { tasks });
});

router.get('/tasks/new', (req, res) => {
  res.render('tasks/new', { error: null, values: { title: '', description: '', status: 'pendiente' } });
});

router.post('/tasks', async (req, res) => {
  const { title, description, status } = req.body;
  if (!title) {
    return res.render('tasks/new', { error: 'El título es obligatorio.', values: { title, description, status } });
  }
  try {
    await Task.create({ title, description, status });
    res.redirect('/');
  } catch (e) {
    res.render('tasks/new', { error: 'Error al crear la tarea.', values: { title, description, status } });
  }
});

router.get('/tasks/:id/edit', async (req, res) => {
  const task = await Task.findById(req.params.id).lean();
  if (!task) return res.redirect('/');
  res.render('tasks/edit', { error: null, task });
});

router.put('/tasks/:id', async (req, res) => {
  const { title, description, status } = req.body;
  try {
    await Task.findByIdAndUpdate(req.params.id, { title, description, status }, { runValidators: true });
    res.redirect('/');
  } catch (e) {
    const task = { _id: req.params.id, title, description, status };
    res.render('tasks/edit', { error: 'Error al actualizar la tarea.', task });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

module.exports = router;
