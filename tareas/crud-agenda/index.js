const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const PORT = 3000;

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.get('/contactos', (req, res) => {
  db.query('SELECT * FROM contactos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.get('/contactos/:id', (req, res) => {
  db.query('SELECT * FROM contactos WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

app.post('/contactos', (req, res) => {
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  db.query(
    'INSERT INTO contactos (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES (?, ?, ?, ?, ?, ?)',
    [nombres, apellidos, fecha_nacimiento, direccion, celular, correo],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId });
    }
  );
});

app.put('/contactos/:id', (req, res) => {
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  db.query(
    'UPDATE contactos SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, direccion = ?, celular = ?, correo = ? WHERE id = ?',
    [nombres, apellidos, fecha_nacimiento, direccion, celular, correo, req.params.id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Contacto actualizado' });
    }
  );
});

app.delete('/contactos/:id', (req, res) => {
  db.query('DELETE FROM contactos WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Contacto eliminado' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});