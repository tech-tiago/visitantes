const User = require('../models/User');

async function isAdmin(req, res, next) {
    try {

        if (req.user && req.user.level === 'admin') {
            console.log('Verificando se o usuário é administrador...');
            console.log('Nível do usuário:', req.user.level);
            next();
        } else {
            return res.status(403).json({ message: 'Acesso negado. Você não é um administrador.' });
        }
    } catch (error) {
        console.error('Erro ao verificar nível de usuário:', error);
        return res.status(500).json({ message: 'Erro no servidor. Por favor, tente novamente mais tarde.' });
    }
}

module.exports = isAdmin;

