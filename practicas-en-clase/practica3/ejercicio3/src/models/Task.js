const { Schema, model } = require('mongoose');

const TaskSchema = new Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  status:      { type: String, enum: ['pendiente', 'en_progreso', 'completado'], default: 'pendiente' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = model('Task', TaskSchema);
