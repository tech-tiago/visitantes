const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(403).json({ message: 'Usuário não encontrado.' });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido.' });
    }
}

module.exports = authenticateToken;
