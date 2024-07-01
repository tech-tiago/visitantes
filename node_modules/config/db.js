const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('registro_visitas', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;