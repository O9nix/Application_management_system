const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('appeals_db', 'admin', 'admin_', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;