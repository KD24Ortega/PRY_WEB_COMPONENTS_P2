const express = require('express');
const router = express.Router();
const controller = require('../controllers/administradores.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');

router.use(verifyToken);
router.use(verifyRole('ADMIN'));

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;