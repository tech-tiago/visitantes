const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/db');
const visitorRoutes = require('./routes/visitorRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Carregar variáveis de ambiente do arquivo .env
require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Middleware para analisar corpos de requisição JSON e URL codificados
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para o favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// Rotas para páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/registro-de-visitas', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'registro-de-visitas.html'));
});

app.get('/visitas-em-aberto', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'visitas-em-aberto.html'));
});

// Rotas da API
app.use('/api/visitors', visitorRoutes);
app.use('/api/auth', authRoutes);



// Sincroniza com o banco de dados e inicia o servidor
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
