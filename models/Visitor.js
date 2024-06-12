const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Visitor = sequelize.define('Visitor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  documento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data_entrada: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  hora_entrada: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  foto: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'createdAt',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updatedAt',
  },
});

module.exports = Visitor;