const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas que solo el admin puede acceder
router.get('/', verifyRole('ADMIN'), controller.getAll);
router.get('/stats', verifyRole('ADMIN'), controller.getStats);
router.get('/rol/:rol', verifyRole('ADMIN'), controller.getByRole);
router.delete('/:id', verifyRole('ADMIN'), controller.delete);
router.post('/:id/reset-password', verifyRole('ADMIN'), controller.resetPassword);

// Rutas que el usuario puede acceder sobre sí mismo
router.get('/:id', controller.getById);
router.put('/:id/change-password', controller.changePassword);
router.put('/:id/username', controller.updateUsername);

module.exports = router;