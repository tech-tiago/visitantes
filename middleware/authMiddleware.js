const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next(); // Passa para o próximo middleware
    } catch (err) {
        return res.sendStatus(403); // Forbidden
    }
}

module.exports = authenticateToken;
