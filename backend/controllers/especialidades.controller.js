const { query } = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const especialidades = await query('SELECT * FROM especialidades ORDER BY Descripcion');
        res.json(especialidades);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener especialidades' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const especialidades = await query(
            'SELECT * FROM especialidades WHERE IdEspecialidad = ?',
            [id]
        );
        
        if (especialidades.length === 0) {
            return res.status(404).json({ error: 'Especialidad no encontrada' });
        }
        
        res.json(especialidades[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener especialidad' });
    }
};

exports.create = async (req, res) => {
    try {
        const { descripcion, dias, franja_hi, franja_hf } = req.body;
        
        const result = await query(
            `INSERT INTO especialidades (Descripcion, Dias, Franja_HI, Franja_HF) 
             VALUES (?, ?, ?, ?)`,
            [descripcion, dias, franja_hi, franja_hf]
        );
        
        res.status(201).json({ 
            message: 'Especialidad creada exitosamente',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al crear especialidad' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, dias, franja_hi, franja_hf } = req.body;
        
        await query(
            `UPDATE especialidades 
             SET Descripcion = ?, Dias = ?, Franja_HI = ?, Franja_HF = ? 
             WHERE IdEspecialidad = ?`,
            [descripcion, dias, franja_hi, franja_hf, id]
        );
        
        res.json({ message: 'Especialidad actualizada exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al actualizar especialidad' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        await query('DELETE FROM especialidades WHERE IdEspecialidad = ?', [id]);
        
        res.json({ message: 'Especialidad eliminada exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar especialidad' });
    }
};