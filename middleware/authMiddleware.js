const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }

        try {
            const fetchedUser = await User.findByPk(user.id);

            if (!fetchedUser) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            req.user = fetchedUser;
            next(); // Passa para o próximo middleware
        } catch (error) {
            console.error('Erro ao verificar usuário:', error);
            res.status(500).json({ message: 'Erro interno ao verificar usuário' });
        }
    });
}

function isAdmin(req, res, next) {
    if (req.user.level !== 'admin') {
        return res.status(403).json({ message: 'Acesso não autorizado' });
    }
    next();
}

module.exports = { authenticateToken, isAdmin };
