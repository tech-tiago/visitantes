const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Senha original:', password);

    // O hook beforeCreate irá hashear a senha
    const user = await User.create({ username, password });
    console.log('Usuário registrado:', user);

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });

      if (!user) {
          return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Obtendo o nível do usuário
      const level = user.level;

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Retorna o token JWT e o nível do usuário
      res.json({ token, level });
  } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ message: 'Erro ao fazer login' });
  }
};
