const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

// Verificar rol específico
const verifyRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ error: 'Usuario no autenticado' });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ 
                error: 'No tienes permisos para acceder a este recurso' 
            });
        }

        next();
    };
};

module.exports = { verifyToken, verifyRole };