
### README.md

```markdown
# Sistema de Gestão de Visitantes

Um sistema abrangente de gestão de visitantes para registrar, rastrear e gerenciar entradas e saídas de visitantes. Construído usando Node.js, Express e MySQL, com um front-end responsivo.

## Funcionalidades
- Registro de visitantes com captura de foto usando uma webcam.
- Gestão de registros de visitantes abertos e fechados.
- Login seguro e registro para administradores.
- Rotas protegidas usando JWT para autenticação.

## Tecnologias Utilizadas
### Frontend
- HTML5
- JavaScript
- Fontawesome
- Foundation.CSS
- DataTables

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize
- bcrypt
- JSON Web Token (JWT)

## Instalação

### Pré-requisitos
- Node.js
- MySQL

### Passos
1. Clone o repositório:
   ```bash
   git clone https://github.com/seuusuario/sistema-gestao-visitantes.git
   cd sistema-gestao-visitantes
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados MySQL:
   - Crie um banco de dados chamado `registro_visitas`.
   - Execute o script SQL fornecido para criar as tabelas necessárias.

4. Configure a conexão com o banco de dados:
   - Crie um arquivo `config/db.js` com o seguinte conteúdo:
     ```javascript
     const { Sequelize } = require('sequelize');

     const sequelize = new Sequelize('registro_visitas', 'seuusuario', 'suasenha', {
         host: 'localhost',
         dialect: 'mysql'
     });

     module.exports = sequelize;
     ```

5. Inicie o servidor:
   ```bash
   node app.js
   ```

## Esquema do Banco de Dados

```sql
CREATE DATABASE registro_visitas;

USE registro_visitas;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE visitantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    documento VARCHAR(50) NOT NULL,
    data_entrada DATE NOT NULL,
    hora_entrada TIME NOT NULL,
    foto LONGBLOB NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    status ENUM('aberto', 'encerrado') NOT NULL DEFAULT 'aberto',
    data_saida DATE,
    hora_saida TIME
);
```

## Estrutura do Projeto

```
sistema-gestao-visitantes/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── visitorController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   └── Visitor.js
├── routes/
│   ├── authRoutes.js
│   └── visitorRoutes.js
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── login.js
│   │   ├── home.js
│   │   ├── visitas-em-aberto.js
│   │   └── registro-de-visitas.js
│   ├── login.html
│   ├── home.html
│   ├── visitas-em-aberto.html
│   └── registro-de-visitas.html
├── app.js
├── package.json
└── README.md
```

## Uso

1. Abra `login.html` no seu navegador e faça login com suas credenciais.
2. Registre visitantes usando `home.html`.
3. Gerencie visitas abertas em `visitas-em-aberto.html`.
4. Veja o histórico de visitas em `registro-de-visitas.html`.

## Endpoints da API

### Autenticação

- **POST** `/api/auth/register`
  - Registra um novo usuário.
  - Corpo: `{ "username": "seuusuario", "password": "suasenha" }`
  ```javascript
  const express = require('express');
  const router = express.Router();
  const authController = require('../controllers/authController');

  router.post('/register', authController.register);
  router.post('/login', authController.login);

  module.exports = router;
  ```

- **POST** `/api/auth/login`
  - Faz login de um usuário existente.
  - Corpo: `{ "username": "seuusuario", "password": "suasenha" }`
  - Resposta: `{ "token": "seu_jwt_token" }`
  ```javascript
  const User = require('../models/User');
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcrypt');

  exports.register = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.create({ username, password });
      res.status(201).json({ message: 'Usuário registrado com sucesso' });
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

      const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  ```

### Visitantes

- **POST** `/api/visitors`
  - Cria um novo registro de visitante.
  - Headers: `Authorization: Bearer <seu_jwt_token>`
  - Corpo: `{ "nome": "nome do visitante", "documento": "número do documento", "data_entrada": "YYYY-MM-DD", "hora_entrada": "HH:MM:SS", "foto": "imagem base64", "motivo": "motivo da visita" }`
  ```javascript
  const express = require('express');
  const router = express.Router();
  const visitorController = require('../controllers/visitorController');
  const authenticateToken = require('../middleware/authMiddleware');

  router.post('/', authenticateToken, visitorController.createVisitor);
  router.get('/open', authenticateToken, visitorController.getOpenVisits);
  router.put('/close/:id', authenticateToken, visitorController.closeVisit);
  router.get('/closed', authenticateToken, visitorController.getClosedVisits);
  router.get('/:id', authenticateToken, visitorController.getVisitor);

  module.exports = router;
  ```

- **GET** `/api/visitors/open`
  - Obtém todas as visitas abertas.
  - Headers: `Authorization: Bearer <seu_jwt_token>`
  ```javascript
  exports.getOpenVisits = async (req, res) => {
    try {
      const openVisits = await Visitor.findAll({ where: { status: 'aberto' } });
      res.json(openVisits);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  ```

- **PUT** `/api/visitors/close/:id`
  - Encerra uma visita aberta.
  - Headers: `Authorization: Bearer <seu_jwt_token>`
  - Corpo: `{ "data_saida": "YYYY-MM-DD", "hora_saida": "HH:MM:SS" }`
  ```javascript
  exports.closeVisit = async (req, res) => {
    try {
      const { data_saida, hora_saida } = req.body;
      const visit = await Visitor.findByPk(req.params.id);

      if (visit) {
        visit.data_saida = data_saida;
        visit.hora_saida = hora_saida;
        visit.status = 'encerrado';
        await visit.save();
        res.json({ message: 'Visita encerrada com sucesso' });
      } else {
        res.status(404).json({ message: 'Visita não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  ```

- **GET** `/api/visitors/closed`
  - Obtém todas as visitas encerradas.
  - Headers: `Authorization: Bearer <seu_jwt_token>`
  ```javascript
  exports.getClosedVisits = async (req, res) => {
    try {
      const closedVisits = await Visitor.findAll({ where: { status: 'encerrado' } });
      res.json(closedVisits);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  ```

- **GET** `/api/visitors/:id`
  - Obtém detalhes de uma visita específica.
  - Headers: `Authorization: Bearer <seu_jwt_token>`
  ```javascript
  exports.getVisitor = async (req, res) => {


    try {
      const visit = await Visitor.findByPk(req.params.id);
      if (visit) {
        res.json(visit);
      } else {
        res.status(404).json({ message: 'Visita não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  ```

## Considerações de Segurança

- Certifique-se de que o segredo JWT usado em `authController.js` seja armazenado de forma segura e não hard-coded em ambientes de produção.
- Use HTTPS para garantir a segurança na transmissão de dados.
- Implemente limitação de taxa e outras melhores práticas de segurança conforme necessário.

## Licença

Este projeto é licenciado sob a licença MIT.
```

