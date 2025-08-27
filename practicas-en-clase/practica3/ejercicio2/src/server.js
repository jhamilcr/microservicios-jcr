require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.urlencoded({ extended: false }));

const usersRouter = require('./routes/users');
app.use('/', usersRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));