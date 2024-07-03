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
      console.log('Default admin user created');
    } else {
      // Se o usuário admin existir, verifica se a senha precisa ser atualizada (por exemplo, se a senha padrão foi alterada)
      const isPasswordCorrect = await bcrypt.compare(defaultAdmin.password, adminUser.password);
      if (!isPasswordCorrect) {
        // Atualiza a senha se for diferente
        const salt = await bcrypt.genSalt(10);
        adminUser.password = await bcrypt.hash(defaultAdmin.password, salt);
        await adminUser.save();
        console.log('Default admin user password updated');
      } else {
        console.log('Default admin user already exists');
      }
    }
  } catch (error) {
    console.error('Error creating or updating default admin user:', error);
  }
};

(async () => {
  try {
    await sequelize.sync();
    await createDefaultAdminUser();
  } catch (error) {
    console.error('Error syncing the database and creating default admin user:', error);
  }
})();

module.exports = User;
