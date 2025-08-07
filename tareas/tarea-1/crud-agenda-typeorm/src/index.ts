import express from 'express';
import path from 'path';
import { AppDataSource } from './data-source';
import contactoRoutes from './routes/contacto.routes';

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

AppDataSource.initialize()
  .then(() => {
    console.log('Base de datos conectada');
    app.use('/contactos', contactoRoutes);

    app.listen(3000, () => {
      console.log('Servidor en http://localhost:3000');
    });
  })
  .catch((err) => console.error(err));
