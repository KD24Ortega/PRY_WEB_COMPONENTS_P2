const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');

// Definir las rutas
router.get('/', controller.getUsers);           // GET /users
router.get('/:id', controller.getUserById);     // GET /users/:id
router.post('/', controller.createUser);        // POST /users
router.put('/:id', controller.updateUser);      // PUT /users/:id
router.delete('/:id', controller.deleteUser);   // DELETE /users/:id

module.exports = router;