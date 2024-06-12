const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Visitor = sequelize.define('Visitor', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data_entrada: {
    type: DataTypes.DATE,
    allowNull: false
  },
  hora_entrada: {
    type: DataTypes.STRING,
    allowNull: false
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('aberto', 'encerrado'),
    allowNull: false,
    defaultValue: 'aberto'
  },
  data_saida: {
    type: DataTypes.DATE,
    allowNull: true
  },
  hora_saida: {
    type: DataTypes.STRING,
    allowNull: true
  },
  foto: {
    type: DataTypes.STRING, 
    allowNull: true 
  }
});

module.exports = Visitor;
