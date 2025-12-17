const { query } = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const pacientes = await query('SELECT * FROM pacientes ORDER BY Nombre');
        res.json(pacientes);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener pacientes' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const pacientes = await query(
            'SELECT * FROM pacientes WHERE IdPaciente = ?',
            [id]
        );
        
        if (pacientes.length === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        
        res.json(pacientes[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener paciente' });
    }
};

exports.create = async (req, res) => {
    try {
        const { nombre, cedula, edad, genero, estatura, peso, foto } = req.body;
        
        const result = await query(
            `INSERT INTO pacientes (Nombre, Cedula, Edad, Genero, Estatura, Peso, Foto) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nombre, cedula, edad, genero, estatura, peso, foto || 'default.jpg']
        );
        
        res.status(201).json({ 
            message: 'Paciente creado exitosamente',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al crear paciente' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, cedula, edad, genero, estatura, peso, foto } = req.body;
        
        await query(
            `UPDATE pacientes 
             SET Nombre = ?, Cedula = ?, Edad = ?, Genero = ?, Estatura = ?, Peso = ?, Foto = ? 
             WHERE IdPaciente = ?`,
            [nombre, cedula, edad, genero, estatura, peso, foto, id]
        );
        
        res.json({ message: 'Paciente actualizado exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al actualizar paciente' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        await query('DELETE FROM pacientes WHERE IdPaciente = ?', [id]);
        
        res.json({ message: 'Paciente eliminado exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar paciente' });
    }
};