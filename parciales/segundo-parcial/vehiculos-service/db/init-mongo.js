// Se ejecuta automáticamente en el primer arranque del contenedor (si el volumen está limpio)
const admin = db.getSiblingDB('admin');
admin.auth(process.env.MONGO_USER, process.env.MONGO_PASS);

const appdb = db.getSiblingDB(process.env.MONGO_DB);

// Colección de ejemplo
appdb.createCollection('vehiculos');

// // Índices útiles
// appdb.items.createIndex({ plac: 1 }, { unique: false });

// // Datos iniciales
// appdb.items.insertMany([
//   { name: 'Notebook', description: 'A5 lined notebook', price: 4.5, createdAt: new Date(), updatedAt: new Date() },
//   { name: 'Pen', description: 'Black gel pen', price: 1.2, createdAt: new Date(), updatedAt: new Date() }
// ]);