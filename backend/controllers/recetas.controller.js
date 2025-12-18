const { query } = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const recetas = await query(
            `SELECT r.*, 
                    c.FechaConsulta, c.Diagnostico,
                    m.Nombre as NombreMedico,
                    p.Nombre as NombrePaciente,
                    med.Nombre as NombreMedicamento, med.Tipo as TipoMedicamento
             FROM recetas r
             INNER JOIN consultas c ON r.IdConsulta = c.IdConsulta
             INNER JOIN medicos m ON c.IdMedico = m.IdMedico
             INNER JOIN pacientes p ON c.IdPaciente = p.IdPaciente
             INNER JOIN medicamentos med ON r.IdMedicamento = med.IdMedicamento
             ORDER BY c.FechaConsulta DESC`
        );
        res.json(recetas);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener recetas' });
    }
};

exports.getByConsulta = async (req, res) => {
    try {
        const { idConsulta } = req.params;
        const recetas = await query(
            `SELECT r.*, 
                    c.FechaConsulta, c.Diagnostico,
                    m.Nombre as NombreMedico,
                    p.Nombre as NombrePaciente,
                    med.Nombre as NombreMedicamento, med.Tipo as TipoMedicamento
             FROM recetas r
             INNER JOIN consultas c ON r.IdConsulta = c.IdConsulta
             INNER JOIN medicos m ON c.IdMedico = m.IdMedico
             INNER JOIN pacientes p ON c.IdPaciente = p.IdPaciente
             INNER JOIN medicamentos med ON r.IdMedicamento = med.IdMedicamento
             WHERE r.IdConsulta = ?`,
            [idConsulta]
        );
        res.json(recetas);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener recetas de la consulta' });
    }
};

exports.getByPaciente = async (req, res) => {
    try {
        const { idPaciente } = req.params;
        const recetas = await query(
            `SELECT r.*, 
                    c.FechaConsulta, c.Diagnostico,
                    m.Nombre as NombreMedico,
                    p.Nombre as NombrePaciente,
                    med.Nombre as NombreMedicamento, med.Tipo as TipoMedicamento
             FROM recetas r
             INNER JOIN consultas c ON r.IdConsulta = c.IdConsulta
             INNER JOIN medicos m ON c.IdMedico = m.IdMedico
             INNER JOIN pacientes p ON c.IdPaciente = p.IdPaciente
             INNER JOIN medicamentos med ON r.IdMedicamento = med.IdMedicamento
             WHERE c.IdPaciente = ?
             ORDER BY c.FechaConsulta DESC`,
            [idPaciente]
        );
        res.json(recetas);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener recetas del paciente' });
    }
};

exports.create = async (req, res) => {
    try {
        // Capturamos instrucciones del body enviado por el frontend
        const { idConsulta, idMedicamento, cantidad, instrucciones } = req.body;
        
        // Insertamos en la nueva columna de la tabla
        const result = await query(
            'INSERT INTO recetas (IdConsulta, IdMedicamento, Cantidad, Instrucciones) VALUES (?, ?, ?, ?)',
            [idConsulta, idMedicamento, cantidad, instrucciones]
        );
        
        const recetaCompleta = await query(
            `SELECT r.*, 
                    c.FechaConsulta, c.Diagnostico,
                    m.Nombre as NombreMedico,
                    p.Nombre as NombrePaciente,
                    med.Nombre as NombreMedicamento, med.Tipo as TipoMedicamento
             FROM recetas r
             INNER JOIN consultas c ON r.IdConsulta = c.IdConsulta
             INNER JOIN medicos m ON c.IdMedico = m.IdMedico
             INNER JOIN pacientes p ON c.IdPaciente = p.IdPaciente
             INNER JOIN medicamentos med ON r.IdMedicamento = med.IdMedicamento
             WHERE r.IdReceta = ?`,
            [result.insertId]
        );
        
        res.status(201).json({ 
            message: 'Receta creada exitosamente',
            id: result.insertId,
            receta: recetaCompleta[0]
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al crear receta' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { idConsulta, idMedicamento, cantidad, instrucciones } = req.body;
        
        await query(
            `UPDATE recetas 
             SET IdConsulta = ?, IdMedicamento = ?, Cantidad = ?, Instrucciones = ? 
             WHERE IdReceta = ?`,
            [idConsulta, idMedicamento, cantidad, instrucciones, id]
        );
        
        res.json({ message: 'Receta actualizada exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al actualizar receta' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM recetas WHERE IdReceta = ?', [id]);
        res.json({ message: 'Receta eliminada exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar receta' });
    }
};