import mongoose from 'mongoose';
import { config } from './config.js';

export async function connectDB() {
  await mongoose.connect(config.mongoUri, { dbName: 'authdb' });
  console.log('MongoDB conectado');
}
