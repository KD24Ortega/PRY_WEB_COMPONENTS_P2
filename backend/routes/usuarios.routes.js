const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload'); // ← Importar middleware

// Todas las rutas requieren autenticación
router.use(verifyToken);

// RUTAS ADMIN
router.get('/', verifyRole('ADMIN'), controller.getAll);
router.get('/stats', verifyRole('ADMIN'), controller.getStats);
router.get('/rol/:rol', verifyRole('ADMIN'), controller.getByRole);
router.delete('/:id', verifyRole('ADMIN'), controller.delete);
router.put('/:id/reset-password', verifyRole('ADMIN'), controller.resetPassword);

// RUTAS DE USUARIO
router.get('/:id', controller.getById);
router.put('/:id/change-password', controller.changePassword);
router.put('/:id/username', controller.updateUsername);

// RUTA DE FOTO CON MULTER
router.put('/:id/foto', upload.single('foto'), controller.updateFoto);

module.exports = router;