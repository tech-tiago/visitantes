const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

require('dotenv').config();

// Configuração do armazenamento do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Middleware para verificar se o usuário é admin
exports.isAdmin = (req, res, next) => {
  if (req.user.level !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  next();
};

// Registro de novo usuário
exports.register = async (req, res) => {
  if (req.user.level !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  upload.single('foto')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      const { username, password, nome, level } = req.body;
      const foto = req.file ? req.file.filename : null;
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({ username, password: hashedPassword, nome, foto, level });

      res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Login de usuário
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, level: user.level, nome: user.nome, foto: user.foto });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ message: 'Erro no servidor. Por favor, tente novamente mais tarde.' });
  }
};

// Obtenção de informações do usuário
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      id: user.id,
      username: user.username,
      nome: user.nome,
      foto: user.foto,
      level: user.level
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter informações do usuário' });
  }
};

// Atualização de informações do usuário por admin
exports.updateUser = async (req, res) => {
  if (req.user.level !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  upload.single('foto')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      const { id, username, nome, password, level } = req.body;
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const oldFoto = user.foto;
      const foto = req.file ? req.file.filename : user.foto;
      const updatedFields = { username, nome, foto, level };

      if (password) {
        updatedFields.password = await bcrypt.hash(password, 10);
      }

      await User.update(updatedFields, { where: { id } });

      if (req.file && oldFoto) {
        fs.unlink(path.join('public/images', oldFoto), (err) => {
          if (err) console.error('Erro ao remover foto antiga:', err);
        });
      }

      res.json({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Atualização de informações do usuário logado
exports.updateUserLog = async (req, res) => {
  upload.single('foto')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      const { id, username, nome, password } = req.body;
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const foto = req.file ? req.file.filename : user.foto;
      const updatedFields = { username, nome, foto };

      if (password) {
        updatedFields.password = await bcrypt.hash(password, 10);
      }

      await User.update(updatedFields, { where: { id } });

      res.json({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Obtenção de todos os usuários
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nome', 'username', 'level', 'foto']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pesquisa de usuários por nome de usuário
exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${query}%`
        }
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Erro ao pesquisar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
