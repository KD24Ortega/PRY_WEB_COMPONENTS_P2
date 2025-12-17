const express = require('express');
const router = express.Router();
const controller = require('../controllers/consultas.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.get('/', verifyRole('ADMIN'), controller.getAll);
router.get('/:id', controller.getById);
router.get('/medico/:idMedico', verifyRole('MEDICO', 'ADMIN'), controller.getByMedico);
router.get('/paciente/:idPaciente', verifyRole('PACIENTE', 'ADMIN'), controller.getByPaciente);
router.post('/', verifyRole('MEDICO', 'ADMIN'), controller.create);
router.put('/:id', verifyRole('MEDICO', 'ADMIN'), controller.update);
router.delete('/:id', verifyRole('ADMIN'), controller.delete);

module.exports = router;