const express = require('express');
const router = express.Router();
const controller = require('../controllers/medicos.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', verifyRole('ADMIN'), controller.create);
router.put('/:id', verifyRole('ADMIN'), controller.update);
router.delete('/:id', verifyRole('ADMIN'), controller.delete);

module.exports = router;