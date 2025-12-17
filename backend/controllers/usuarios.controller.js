const bcrypt = require('bcryptjs');
const { query } = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const usuarios = await query(
            `SELECT u.IdUsuario, u.Usuario, u.Rol,
                    u.IdMedico, u.IdPaciente, u.IdAdministrador,
                    m.Nombre as NombreMedico, e.Descripcion as EspecialidadMedico,
                    p.Nombre as NombrePaciente, p.Cedula,
                    a.Nombre as NombreAdmin, a.Correo
             FROM usuarios u
             LEFT JOIN medicos m ON u.IdMedico = m.IdMedico
             LEFT JOIN especialidades e ON m.IdEspecialidad = e.IdEspecialidad
             LEFT JOIN pacientes p ON u.IdPaciente = p.IdPaciente
             LEFT JOIN administradores a ON u.IdAdministrador = a.IdAdministrador
             ORDER BY u.IdUsuario DESC`
        );
        
        // Formatear respuesta
        const usuariosFormateados = usuarios.map(u => {
            let nombre = '';
            let detalles = {};
            
            switch(u.Rol) {
                case 'MEDICO':
                    nombre = u.NombreMedico;
                    detalles = {
                        especialidad: u.EspecialidadMedico,
                        idMedico: u.IdMedico
                    };
                    break;
                case 'PACIENTE':
                    nombre = u.NombrePaciente;
                    detalles = {
                        cedula: u.Cedula,
                        idPaciente: u.IdPaciente
                    };
                    break;
                case 'ADMIN':
                    nombre = u.NombreAdmin;
                    detalles = {
                        correo: u.Correo,
                        idAdministrador: u.IdAdministrador
                    };
                    break;
            }
            
            return {
                idUsuario: u.IdUsuario,
                usuario: u.Usuario,
                rol: u.Rol,
                nombre: nombre,
                ...detalles
            };
        });
        
        res.json(usuariosFormateados);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarios = await query(
            `SELECT u.IdUsuario, u.Usuario, u.Rol,
                    u.IdMedico, u.IdPaciente, u.IdAdministrador,
                    m.Nombre as NombreMedico, m.IdEspecialidad, m.Foto as FotoMedico,
                    e.Descripcion as EspecialidadMedico,
                    p.Nombre as NombrePaciente, p.Cedula, p.Edad, p.Genero, 
                    p.Estatura, p.Peso, p.Foto as FotoPaciente,
                    a.Nombre as NombreAdmin, a.Correo
             FROM usuarios u
             LEFT JOIN medicos m ON u.IdMedico = m.IdMedico
             LEFT JOIN especialidades e ON m.IdEspecialidad = e.IdEspecialidad
             LEFT JOIN pacientes p ON u.IdPaciente = p.IdPaciente
             LEFT JOIN administradores a ON u.IdAdministrador = a.IdAdministrador
             WHERE u.IdUsuario = ?`,
            [id]
        );
        
        if (usuarios.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const u = usuarios[0];
        let nombre = '';
        let detalles = {};
        
        switch(u.Rol) {
            case 'MEDICO':
                nombre = u.NombreMedico;
                detalles = {
                    idMedico: u.IdMedico,
                    idEspecialidad: u.IdEspecialidad,
                    especialidad: u.EspecialidadMedico,
                    foto: u.FotoMedico
                };
                break;
            case 'PACIENTE':
                nombre = u.NombrePaciente;
                detalles = {
                    idPaciente: u.IdPaciente,
                    cedula: u.Cedula,
                    edad: u.Edad,
                    genero: u.Genero,
                    estatura: u.Estatura,
                    peso: u.Peso,
                    foto: u.FotoPaciente
                };
                break;
            case 'ADMIN':
                nombre = u.NombreAdmin;
                detalles = {
                    idAdministrador: u.IdAdministrador,
                    correo: u.Correo
                };
                break;
        }
        
        res.json({
            idUsuario: u.IdUsuario,
            usuario: u.Usuario,
            rol: u.Rol,
            nombre: nombre,
            ...detalles
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;
        
        // Validaciones
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                error: 'La contraseña actual y la nueva son requeridas' 
            });
        }
        
        if (newPassword.length < 3) {
            return res.status(400).json({ 
                error: 'La nueva contraseña debe tener al menos tres caracteres' 
            });
        }
        
        // Obtener usuario
        const usuarios = await query(
            'SELECT * FROM usuarios WHERE IdUsuario = ?',
            [id]
        );
        
        if (usuarios.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const usuario = usuarios[0];
        
        // Verificar contraseña actual
        const validPassword = await bcrypt.compare(currentPassword, usuario.PasswordHash);
        if (!validPassword) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
        }
        
        // Hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Actualizar contraseña
        await query(
            'UPDATE usuarios SET PasswordHash = ? WHERE IdUsuario = ?',
            [hashedPassword, id]
        );
        
        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al cambiar contraseña' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        
        // Validación
        if (!newPassword) {
            return res.status(400).json({ error: 'La nueva contraseña es requerida' });
        }
        
        if (newPassword.length < 3) {
            return res.status(400).json({ 
                error: 'La contraseña debe tener al menos tres caracteres' 
            });
        }
        
        // Verificar que el usuario existe
        const usuarios = await query(
            'SELECT * FROM usuarios WHERE IdUsuario = ?',
            [id]
        );
        
        if (usuarios.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        // Hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Actualizar contraseña
        await query(
            'UPDATE usuarios SET PasswordHash = ? WHERE IdUsuario = ?',
            [hashedPassword, id]
        );
        
        res.json({ 
            message: 'Contraseña restablecida exitosamente',
            info: 'El usuario debe iniciar sesión con la nueva contraseña'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al restablecer contraseña' });
    }
};

exports.updateUsername = async (req, res) => {
    try {
        const { id } = req.params;
        const { newUsername } = req.body;
        
        // Validación
        if (!newUsername) {
            return res.status(400).json({ error: 'El nuevo nombre de usuario es requerido' });
        }
        
        if (newUsername.length < 3) {
            return res.status(400).json({ 
                error: 'El nombre de usuario debe tener al menos tres caracteres' 
            });
        }
        
        // Verificar que el nuevo nombre de usuario no esté en uso
        const existingUser = await query(
            'SELECT * FROM usuarios WHERE Usuario = ? AND IdUsuario != ?',
            [newUsername, id]
        );
        
        if (existingUser.length > 0) {
            return res.status(400).json({ 
                error: 'El nombre de usuario ya está en uso' 
            });
        }
        
        // Actualizar nombre de usuario
        const result = await query(
            'UPDATE usuarios SET Usuario = ? WHERE IdUsuario = ?',
            [newUsername, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json({ message: 'Nombre de usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al actualizar nombre de usuario' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que no sea el admin principal
        const usuario = await query(
            'SELECT Usuario FROM usuarios WHERE IdUsuario = ?',
            [id]
        );
        
        if (usuario.length > 0 && usuario[0].Usuario === 'admin') {
            return res.status(403).json({ 
                error: 'No se puede eliminar el usuario administrador principal del sistema' 
            });
        }
        
        // Eliminar usuario (las relaciones se eliminarán en cascada)
        const result = await query(
            'DELETE FROM usuarios WHERE IdUsuario = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

exports.getByRole = async (req, res) => {
    try {
        const { rol } = req.params;
        
        // Validar rol
        if (!['MEDICO', 'PACIENTE', 'ADMIN'].includes(rol)) {
            return res.status(400).json({ error: 'Rol no válido' });
        }
        
        const usuarios = await query(
            `SELECT u.IdUsuario, u.Usuario, u.Rol,
                    m.Nombre as NombreMedico, e.Descripcion as EspecialidadMedico,
                    p.Nombre as NombrePaciente, p.Cedula,
                    a.Nombre as NombreAdmin, a.Correo
             FROM usuarios u
             LEFT JOIN medicos m ON u.IdMedico = m.IdMedico
             LEFT JOIN especialidades e ON m.IdEspecialidad = e.IdEspecialidad
             LEFT JOIN pacientes p ON u.IdPaciente = p.IdPaciente
             LEFT JOIN administradores a ON u.IdAdministrador = a.IdAdministrador
             WHERE u.Rol = ?
             ORDER BY u.IdUsuario DESC`,
            [rol]
        );
        
        // Formatear respuesta
        const usuariosFormateados = usuarios.map(u => {
            let nombre = '';
            let detalles = {};
            
            switch(u.Rol) {
                case 'MEDICO':
                    nombre = u.NombreMedico;
                    detalles = { especialidad: u.EspecialidadMedico };
                    break;
                case 'PACIENTE':
                    nombre = u.NombrePaciente;
                    detalles = { cedula: u.Cedula };
                    break;
                case 'ADMIN':
                    nombre = u.NombreAdmin;
                    detalles = { correo: u.Correo };
                    break;
            }
            
            return {
                idUsuario: u.IdUsuario,
                usuario: u.Usuario,
                rol: u.Rol,
                nombre: nombre,
                ...detalles
            };
        });
        
        res.json(usuariosFormateados);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener usuarios por rol' });
    }
};

exports.getStats = async (req, res) => {
    try {
        const stats = await query(
            `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN Rol = 'MEDICO' THEN 1 ELSE 0 END) as medicos,
                SUM(CASE WHEN Rol = 'PACIENTE' THEN 1 ELSE 0 END) as pacientes,
                SUM(CASE WHEN Rol = 'ADMIN' THEN 1 ELSE 0 END) as administradores
             FROM usuarios`
        );
        
        res.json(stats[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};