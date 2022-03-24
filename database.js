const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const app2 = express();
const connection = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Połączono.'))
  .catch((err) => console.log(err));

const PORT_DB = process.env.PORT_DB;

const db = app.listen(PORT_DB, () => {
  console.log(`Aplikacja działa na porcie ${PORT_DB}.`);
});
