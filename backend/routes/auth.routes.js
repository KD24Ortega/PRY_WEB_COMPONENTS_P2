const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/especialidades', authController.getEspecialidadesPublic);

// Rutas protegidas
router.get('/verify', verifyToken, authController.verifySession);

module.exports = router;