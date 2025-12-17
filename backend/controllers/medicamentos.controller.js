const { query } = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const medicamentos = await query('SELECT * FROM medicamentos ORDER BY Nombre');
        res.json(medicamentos);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener medicamentos' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const medicamentos = await query(
            'SELECT * FROM medicamentos WHERE IdMedicamento = ?',
            [id]
        );
        
        if (medicamentos.length === 0) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }
        
        res.json(medicamentos[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener medicamento' });
    }
};

exports.create = async (req, res) => {
    try {
        const { nombre, tipo } = req.body;
        
        const result = await query(
            'INSERT INTO medicamentos (Nombre, Tipo) VALUES (?, ?)',
            [nombre, tipo]
        );
        
        res.status(201).json({ 
            message: 'Medicamento creado exitosamente',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al crear medicamento' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, tipo } = req.body;
        
        await query(
            'UPDATE medicamentos SET Nombre = ?, Tipo = ? WHERE IdMedicamento = ?',
            [nombre, tipo, id]
        );
        
        res.json({ message: 'Medicamento actualizado exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al actualizar medicamento' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        await query('DELETE FROM medicamentos WHERE IdMedicamento = ?', [id]);
        
        res.json({ message: 'Medicamento eliminado exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar medicamento' });
    }
};