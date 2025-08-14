import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import agendaRouter from './routes/agenda.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/agenda', agendaRouter);

const { MONGODB_URI, PORT = 3000 } = process.env;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('DB conectada');
    app.listen(PORT, () => console.log('API lista en http://localhost:${PORT}'));
  })
  .catch(err => {
    console.error('Error conectando a MongoDB', err.message);
    process.exit(1);
  });