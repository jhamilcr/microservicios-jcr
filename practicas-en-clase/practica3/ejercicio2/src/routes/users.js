const { Router } = require('express');
const pool = require('../db');
const router = Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, created_at FROM users ORDER BY id DESC'
  );
  res.render('users', { users: rows, error: null });
});

router.post('/users', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id DESC');
    return res.render('users', { users: rows, error: 'Nombre y correo son obligatorios.' });
  }

  try {
    await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name.trim(), email.trim()]);
    return res.redirect('/');
  } catch (e) {
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id DESC');
    const msg = e.code === 'ER_DUP_ENTRY' ? 'Ese correo ya existe.' : 'Error al crear usuario.';
    return res.render('users', { users: rows, error: msg });
  }
});

router.post('/users/:id/delete', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
  res.redirect('/');
});

module.exports = router;
