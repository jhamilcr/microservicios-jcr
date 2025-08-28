require('dotenv').config();
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const { connectDB } = require('./db');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use('/', require('./routes/tasks'));

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}).catch(err => {
  console.error('Error conectando a MongoDB:', err.message);
  process.exit(1);
});
