const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }
    console.log('Token recebido:', token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);
        const user = await User.findByPk(decoded.id);
        console.log('Usuário encontrado:', user);
        if (!user) {
            return res.status(403).json({ message: 'Usuário não encontrado.' });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error('Erro ao verificar token:', err);
        return res.status(403).json({ message: 'Token inválido.' });
    }
}

module.exports = authenticateToken;
