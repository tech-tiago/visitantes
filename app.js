const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/db');
const User = require('./models/User');
const visitorRoutes = require('./routes/visitorRoutes');
const authRoutes = require('./routes/authRoutes');


const app = express();

// Middleware para analisar corpos de requisição JSON e URL codificados
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Rota para o favicon.ico
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'favicon.ico'));
});

// Rotas para páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'home.html'));
});

// Rotas para páginas HTML
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'register.html'));
});

app.get('/edituser', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'editUser.html'));
});

app.get('/historico-de-visitas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'historico-de-visitas.html'));
});

app.get('/visitas-em-aberto', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'visitas-em-aberto.html'));
});

app.get('/mensagens', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'mensagens.html'));
});

// Rotas da API
app.use('/api/visitors', visitorRoutes);
app.use('/api/auth', authRoutes);

// Sincroniza com o banco de dados e inicia o servidor
sequelize.sync().then(async () => {
    try {
      // Chame a função de inicialização aqui
      await User.initialize();
      // Inicie o servidor
      app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
      });
    } catch (err) {
      console.error('Erro durante a inicialização:', err);
    }
  }).catch(err => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  })
