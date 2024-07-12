function isAdmin(req, res, next) {
    if (req.user && req.user.level === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Acesso negado. Você não é um administrador.' });
    }
}

module.exports = isAdmin;
