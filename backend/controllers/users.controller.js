const db = require('../db');

// Obtener todos los usuarios
exports.getUsers = (req, res) => {
    db.query('SELECT * FROM usuarios ORDER BY id DESC', (err, rows) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }
        res.json(rows);
    });
};

// Obtener un usuario por ID
exports.getUserById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, rows) => {
        if (err) {
            console.error('Error al obtener usuario:', err);
            return res.status(500).json({ error: 'Error al obtener usuario' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    });
};

// Crear un nuevo usuario
exports.createUser = (req, res) => {
    const { nombre, correo, rol, estado } = req.body;
    
    // Validación básica
    if (!nombre || !correo || !rol || !estado) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    db.query(
        'INSERT INTO usuarios (nombre, correo, rol, estado) VALUES (?, ?, ?, ?)',
        [nombre, correo, rol, estado],
        (err, result) => {
            if (err) {
                console.error('Error al crear usuario:', err);
                return res.status(500).json({ error: 'Error al crear usuario' });
            }
            res.status(201).json({ 
                message: 'Usuario registrado exitosamente en la clínica',
                id: result.insertId 
            });
        }
    );
};

// Actualizar un usuario
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { nombre, correo, rol, estado } = req.body;
    
    db.query(
        'UPDATE usuarios SET nombre = ?, correo = ?, rol = ?, estado = ? WHERE id = ?',
        [nombre, correo, rol, estado, id],
        (err, result) => {
            if (err) {
                console.error('Error al actualizar usuario:', err);
                return res.status(500).json({ error: 'Error al actualizar usuario' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json({ message: 'Usuario actualizado exitosamente' });
        }
    );
};

// Eliminar un usuario
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            return res.status(500).json({ error: 'Error al eliminar usuario' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado exitosamente' });
    });
};