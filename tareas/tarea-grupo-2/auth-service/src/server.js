import { connectDB } from './db.js';
import { config } from './config.js';
import app from './app.js';

const start = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Auth service en http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error('Fallo al iniciar', err);
    process.exit(1);
  }
};

start();
