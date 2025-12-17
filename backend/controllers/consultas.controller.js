const { query } = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const consultas = await query(
            `SELECT c.*, 
                    m.Nombre as NombreMedico, 
                    p.Nombre as NombrePaciente,
                    e.Descripcion as Especialidad
             FROM consultas c
             INNER JOIN medicos m ON c.IdMedico = m.IdMedico
             INNER JOIN pacientes p ON c.IdPaciente = p.IdPaciente
             INNER JOIN especialidades e ON m.IdEspecialidad = e.IdEspecialidad
             ORDER BY c.FechaConsulta DESC, c.HI DESC`
        );
        res.json(consultas);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener consultas' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const consultas = await query(
            `SELECT c.*, 
                    m.Nombre as NombreMedico, 
                    p.Nombre as NombrePaciente, p.Cedula, p.Edad, p.Genero,
                    e.Descripcion as Especialidad
             FROM consultas c
             INNER JOIN medicos m ON c.IdMedico = m.IdMedico
             INNER JOIN pacientes p ON c.IdPaciente = p.IdPaciente
             INNER JOIN especialidades e ON m.IdEspecialidad = e.IdEspecialidad
             WHERE c.IdConsulta = ?`,
            [id]
        );
        
        if (consultas.length === 0) {
            return res.status(404).json({ error: 'Consulta no encontrada' });
        }
        
        res.json(consultas[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener consulta' });
    }
};

exports.getByMedico = async (req, res) => {
    try {
        const { idMedico } = req.params;
        const consultas = await query(
            `SELECT c.*, 
                    m.Nombre as NombreMedico, 
                    p.Nombre as NombrePaciente, p.Cedula,
                    e.Descripcion as Especialidad
             FROM consultas c
             INNER JOIN medicos m ON c.IdMedico = m.IdMedico
             INNER JOIN pacientes p ON c.IdPaciente = p.IdPaciente
             INNER JOIN especialidades e ON m.IdEspecialidad = e.IdEspecialidad
             WHERE c.IdMedico = ?
             ORDER BY c.FechaConsulta DESC, c.HI DESC`,
            [idMedico]
        );
        res.json(consultas);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener consultas del médico' });
    }
};

exports.getByPaciente = async (req, res) => {
    try {
        const { idPaciente } = req.params;
        const consultas = await query(
            `SELECT c.*, 
                    m.Nombre as NombreMedico, 
                    p.Nombre as NombrePaciente,
                    e.Descripcion as Especialidad
             FROM consultas c
             INNER JOIN medicos m ON c.IdMedico = m.IdMedico
             INNER JOIN pacientes p ON c.IdPaciente = p.IdPaciente
             INNER JOIN especialidades e ON m.IdEspecialidad = e.IdEspecialidad
             WHERE c.IdPaciente = ?
             ORDER BY c.FechaConsulta DESC, c.HI DESC`,
            [idPaciente]
        );
        res.json(consultas);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener consultas del paciente' });
    }
};

exports.create = async (req, res) => {
    try {
        const { idMedico, idPaciente, fechaConsulta, hi, hf, diagnostico } = req.body;
        
        const result = await query(
            `INSERT INTO consultas (IdMedico, IdPaciente, FechaConsulta, HI, HF, Diagnostico) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [idMedico, idPaciente, fechaConsulta, hi, hf, diagnostico]
        );
        
        res.status(201).json({ 
            message: 'Consulta creada exitosamente',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al crear consulta' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { idMedico, idPaciente, fechaConsulta, hi, hf, diagnostico } = req.body;
        
        await query(
            `UPDATE consultas 
             SET IdMedico = ?, IdPaciente = ?, FechaConsulta = ?, HI = ?, HF = ?, Diagnostico = ? 
             WHERE IdConsulta = ?`,
            [idMedico, idPaciente, fechaConsulta, hi, hf, diagnostico, id]
        );
        
        res.json({ message: 'Consulta actualizada exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al actualizar consulta' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        await query('DELETE FROM consultas WHERE IdConsulta = ?', [id]);
        
        res.json({ message: 'Consulta eliminada exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar consulta' });
    }
};