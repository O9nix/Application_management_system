const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const appealRoutes = require('./routes/appealRoutes');
const { Op } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Подключение маршрутов
app.use('/api/appeals', appealRoutes);

// Синхронизация с БД и запуск сервера
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Ошибка подключения к БД:', err);
  });