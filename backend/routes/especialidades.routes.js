const express = require('express');
const router = express.Router();
const controller = require('../controllers/especialidades.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(verifyToken);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Solo admin puede crear, actualizar y eliminar
router.post('/', verifyRole('ADMIN'), controller.create);
router.put('/:id', verifyRole('ADMIN'), controller.update);
router.delete('/:id', verifyRole('ADMIN'), controller.delete);

module.exports = router;