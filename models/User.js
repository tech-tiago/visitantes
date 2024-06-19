const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('normal', 'admin'),
    allowNull: false,
    defaultValue: 'normal'
  }
});

// Função para criar um usuário padrão se ele não existir
const createDefaultUser = async () => {
  const defaultUser = {
    username: 'root',
    password: '$2a$10$pds2eBrdYwVD3U2adqx2wO2VQa0pIMfvbzasTJKJXUfxu6t/DgU9O',
    level: 'admin'
  };

  try {
    const user = await User.findOne({ where: { username: defaultUser.username } });
    if (!user) {
      await User.create(defaultUser);
      console.log('Usuário padrão criado com sucesso.');
    } else {
      console.log('Usuário padrão já existe.');
    }
  } catch (error) {
    console.error('Erro ao criar o usuário padrão:', error);
  }
};

// Chame a função para criar o usuário padrão após a sincronização do modelo
sequelize.sync()
  .then(() => {
    createDefaultUser();
  })
  .catch(error => {
    console.error('Erro ao sincronizar o banco de dados:', error);
  });

module.exports = User;
