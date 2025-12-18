const { query } = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const medicos = await query(
            `SELECT m.*, e.Descripcion as Especialidad 
             FROM medicos m
             INNER JOIN especialidades e ON m.IdEspecialidad = e.IdEspecialidad
             ORDER BY m.Nombre`
        );
        res.json(medicos);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener médicos' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const medicos = await query(
            `SELECT m.*, e.Descripcion as Especialidad, e.Dias, e.Franja_HI, e.Franja_HF
             FROM medicos m
             INNER JOIN especialidades e ON m.IdEspecialidad = e.IdEspecialidad
             WHERE m.IdMedico = ?`,
            [id]
        );
        
        if (medicos.length === 0) {
            return res.status(404).json({ error: 'Médico no encontrado' });
        }
        
        res.json(medicos[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener médico' });
    }
};

exports.create = async (req, res) => {
    try {
        const { nombre, idEspecialidad } = req.body;
        
        const result = await query(
            'INSERT INTO medicos (Nombre, IdEspecialidad) VALUES (?, ?)',
            [nombre, idEspecialidad]
        );
        
        res.status(201).json({ 
            message: 'Médico creado exitosamente',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al crear médico' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, idEspecialidad } = req.body;
        
        await query(
            'UPDATE medicos SET Nombre = ?, IdEspecialidad = ? WHERE IdMedico = ?',
            [nombre, idEspecialidad, id]
        );
        
        res.json({ message: 'Médico actualizado exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al actualizar médico' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        await query('DELETE FROM medicos WHERE IdMedico = ?', [id]);
        
        res.json({ message: 'Médico eliminado exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar médico' });
    }
};