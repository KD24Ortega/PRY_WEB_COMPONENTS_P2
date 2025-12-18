const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload'); // ← Importar middleware

router.use(verifyToken);

router.get('/', verifyRole('ADMIN'), controller.getAll);
router.get('/stats', verifyRole('ADMIN'), controller.getStats);
router.get('/rol/:rol', verifyRole('ADMIN'), controller.getByRole);
router.delete('/:id', verifyRole('ADMIN'), controller.delete);
router.put('/:id/reset-password', verifyRole('ADMIN'), controller.resetPassword);

router.get('/:id', controller.getById);
router.put('/:id/change-password', controller.changePassword);
router.put('/:id/username', controller.updateUsername);

router.put('/:id/foto', upload.single('foto'), controller.updateFoto);

module.exports = router;