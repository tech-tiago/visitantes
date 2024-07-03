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

const createDefaultAdminUser = async () => {
  const defaultAdmin = {
    nome: 'Admin',
    username: 'admin',
    password: '123123',
    foto: 'avatar-admin.png',
    level: 'admin'
  };

  try {
    let adminUser = await User.findOne({ where: { username: 'admin' } });

    if (!adminUser) {
      // Se o usuário admin não existir, cria-o
      await User.create(defaultAdmin);
      console.log('Usuário administrador padrão criado');
    } else {
      console.log('Usuário já existe no banco de dados');
    }
  } catch (error) {
    console.error('Erro ao criar ou atualizar o usuário administrador padrão:', error);
  }
};

(async () => {
  try {
    await sequelize.sync();
    await createDefaultAdminUser();
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados e criar o usuário administrador padrão:', error);
  }
})();

module.exports = User;
