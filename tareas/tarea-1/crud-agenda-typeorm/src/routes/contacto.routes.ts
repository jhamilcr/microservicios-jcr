import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Contacto } from '../entity/Contacto';

const router = Router();
const repo = AppDataSource.getRepository(Contacto);

// Obtener todos
router.get('/', async (req, res) => {
  const contactos = await repo.find();
  res.json(contactos);
});

// Obtener uno
router.get('/:id', async (req, res) => {
  const contacto = await repo.findOneBy({ id: Number(req.params.id) });
  res.json(contacto);
});

// Crear
router.post('/', async (req, res) => {
  const contacto = repo.create(req.body);
  const result = await repo.save(contacto);
  res.json(result);
});

// Actualizar
router.put('/:id', async (req, res) => {
  const contacto = await repo.findOneBy({ id: Number(req.params.id) });
  if (!contacto) return res.status(404).json({ message: 'No encontrado' });

  repo.merge(contacto, req.body);
  const result = await repo.save(contacto);
  res.json(result);
});

// Eliminar
router.delete('/:id', async (req, res) => {
  const result = await repo.delete(req.params.id);
  res.json(result);
});

export default router;
