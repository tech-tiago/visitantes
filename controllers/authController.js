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
    console.log(`Tentativa de login para o usuário: ${username}`);

    const user = await User.findOne({ where: { username } });
    console.log('Usuário encontrado:', user);

    if (!user) {
      console.log('Usuário não encontrado');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Log the plain password and hashed password for debugging
    console.log('Senha fornecida (plain text):', JSON.stringify(password.trim()));
    console.log('Senha armazenada (hashed):', user.password);

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log('Comparação de senha:', isMatch);

    if (!isMatch) {
      console.log('Senha incorreta');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};
