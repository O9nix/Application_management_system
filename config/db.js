const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ИМЯ_БАЗЫ_ДАННЫХ', 'ЛОГИН', 'ПАРОЛЬ', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;