const { query } = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const administradores = await query(
            `SELECT a.*, u.Usuario, u.Rol
             FROM administradores a
             LEFT JOIN usuarios u ON a.IdAdministrador = u.IdAdministrador
             ORDER BY a.Nombre`
        );
        res.json(administradores);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener administradores' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const administradores = await query(
            `SELECT a.*, u.Usuario, u.Rol
             FROM administradores a
             LEFT JOIN usuarios u ON a.IdAdministrador = u.IdAdministrador
             WHERE a.IdAdministrador = ?`,
            [id]
        );
        
        if (administradores.length === 0) {
            return res.status(404).json({ error: 'Administrador no encontrado' });
        }
        
        res.json(administradores[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener administrador' });
    }
};

exports.create = async (req, res) => {
    try {
        const { nombre, correo } = req.body;
        
        // Validar que el correo no esté en uso
        const existingAdmin = await query(
            'SELECT * FROM administradores WHERE Correo = ?',
            [correo]
        );
        
        if (existingAdmin.length > 0) {
            return res.status(400).json({ error: 'El correo ya está en uso' });
        }
        
        const result = await query(
            'INSERT INTO administradores (Nombre, Correo) VALUES (?, ?)',
            [nombre, correo]
        );
        
        res.status(201).json({ 
            message: 'Administrador creado exitosamente',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al crear administrador' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, correo } = req.body;
        
        const existingAdmin = await query(
            'SELECT * FROM administradores WHERE Correo = ? AND IdAdministrador != ?',
            [correo, id]
        );
        
        if (existingAdmin.length > 0) {
            return res.status(400).json({ error: 'El correo ya está en uso' });
        }
        
        const result = await query(
            'UPDATE administradores SET Nombre = ?, Correo = ? WHERE IdAdministrador = ?',
            [nombre, correo, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Administrador no encontrado' });
        }
        
        res.json({ message: 'Administrador actualizado exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al actualizar administrador' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        const admin = await query(
            `SELECT u.Usuario 
             FROM administradores a
             INNER JOIN usuarios u ON a.IdAdministrador = u.IdAdministrador
             WHERE a.IdAdministrador = ?`,
            [id]
        );
        
        if (admin.length > 0 && admin[0].Usuario === 'admin') {
            return res.status(403).json({ 
                error: 'No se puede eliminar el administrador principal del sistema' 
            });
        }
        
        const result = await query(
            'DELETE FROM administradores WHERE IdAdministrador = ?', 
            [id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Administrador no encontrado' });
        }
        
        res.json({ message: 'Administrador eliminado exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar administrador' });
    }
};