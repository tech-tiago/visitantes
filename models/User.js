const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

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
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  foto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  level: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'normal'
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Função de inicialização
User.initialize = async () => {
  const adminUser = await User.findOne({ where: { username: 'admin' } });
  if (!adminUser) {
    await User.create({
      nome: 'Admin',
      username: 'admin',
      password: '123',
      foto: 'avatar-admin.png',
      level: 'admin'
    });
  }

  const suporteUser = await User.findOne({ where: { username: 'suporte' } });
  if (!suporteUser) {
    await User.create({
      nome: 'Suporte Técnico',
      username: 'suporte',
      password: '123',
      foto: 'avatar-admin.png',
      level: 'normal'
    });
  }
};

module.exports = User;
