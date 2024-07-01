const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

exports.register = async (req, res) => {
  upload.single('foto')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      const { username, password, nome } = req.body;
      const foto = req.file ? req.file.filename : null;
      console.log('Senha original:', password);

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hashedPassword, nome, foto });
      console.log('Usuário registrado:', user);

      res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, level: user.level, nome: user.nome, foto: user.foto });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      username: user.username,
      nome: user.nome,
      foto: user.foto,
      level: user.level
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter informações do usuário' });
  }
};

exports.updateUser = async (req, res) => {
  upload.single('foto')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      const { username, nome, password } = req.body;
      const foto = req.file ? req.file.filename : req.user.foto;

      const updatedFields = { username, nome, foto };

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedFields.password = hashedPassword;
      }

      await User.update(updatedFields, { where: { id: req.user.id } });

      res.json({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};
