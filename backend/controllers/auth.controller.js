const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const jwtConfig = require('../config/jwt.config');

// Inicializar administrador por defecto
exports.initializeAdmin = async () => {
    try {
        const existingAdmin = await query(
            'SELECT * FROM usuarios WHERE Usuario = ?',
            ['admin']
        );

        if (existingAdmin.length > 0) {
            console.log('✅ Administrador por defecto ya existe');
            return;
        }

        const adminData = await query(
            'INSERT INTO administradores (Nombre, Correo) VALUES (?, ?)',
            ['Administrador Sistema', 'admin@clinica.com']
        );

        const hashedPassword = await bcrypt.hash('123', 10);

        await query(
            `INSERT INTO usuarios (Usuario, PasswordHash, Rol, IdAdministrador) 
             VALUES (?, ?, ?, ?)`,
            ['admin', hashedPassword, 'ADMIN', adminData.insertId]
        );

        console.log('✅ Administrador por defecto creado exitosamente');
    } catch (error) {
        console.error('❌ Error al crear administrador por defecto:', error);
    }
};

// Registro de usuarios
exports.register = async (req, res) => {
    try {
        const { usuario, password, rol, datosPersonales } = req.body;

        if (!usuario || !password || !rol) {
            return res.status(400).json({ error: 'Usuario, contraseña y rol son requeridos' });
        }

        const existingUser = await query('SELECT * FROM usuarios WHERE Usuario = ?', [usuario]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let relacionId = null;

        switch (rol) {
            case 'MEDICO':
                const medico = await query(
                    'INSERT INTO medicos (Nombre, IdEspecialidad) VALUES (?, ?)',
                    [datosPersonales.nombre, datosPersonales.idEspecialidad]
                );
                relacionId = medico.insertId;
                await query(
                    `INSERT INTO usuarios (Usuario, PasswordHash, Rol, IdMedico, Foto) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [usuario, hashedPassword, rol, relacionId, datosPersonales.foto || null]
                );
                break;

            case 'PACIENTE':
                const paciente = await query(
                    `INSERT INTO pacientes (Nombre, Cedula, Edad, Genero, Estatura, Peso) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        datosPersonales.nombre, datosPersonales.cedula,
                        datosPersonales.edad || 0, datosPersonales.genero || 'No especificado',
                        datosPersonales.estatura || 0, datosPersonales.peso || 0
                    ]
                );
                relacionId = paciente.insertId;
                await query(
                    `INSERT INTO usuarios (Usuario, PasswordHash, Rol, IdPaciente, Foto) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [usuario, hashedPassword, rol, relacionId, datosPersonales.foto || null]
                );
                break;

            case 'ADMIN':
                const admin = await query(
                    'INSERT INTO administradores (Nombre, Correo) VALUES (?, ?)',
                    [datosPersonales.nombre, datosPersonales.correo]
                );
                relacionId = admin.insertId;
                await query(
                    `INSERT INTO usuarios (Usuario, PasswordHash, Rol, IdAdministrador, Foto) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [usuario, hashedPassword, rol, relacionId, datosPersonales.foto || null]
                );
                break;

            default:
                return res.status(400).json({ error: 'Rol no válido' });
        }

        res.status(201).json({ message: 'Usuario registrado exitosamente', usuario, rol });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
        }

        // SE AGREGÓ u.Foto a la consulta
        const users = await query(
            `SELECT u.IdUsuario, u.Usuario, u.PasswordHash, u.Rol, u.Foto,
                    u.IdMedico, u.IdPaciente, u.IdAdministrador,
                    m.Nombre as NombreMedico, m.IdEspecialidad,
                    p.Nombre as NombrePaciente, p.Cedula,
                    a.Nombre as NombreAdmin, a.Correo
             FROM usuarios u
             LEFT JOIN medicos m ON u.IdMedico = m.IdMedico
             LEFT JOIN pacientes p ON u.IdPaciente = p.IdPaciente
             LEFT JOIN administradores a ON u.IdAdministrador = a.IdAdministrador
             WHERE u.Usuario = ?`,
            [usuario]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.PasswordHash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            { 
                idUsuario: user.IdUsuario,
                usuario: user.Usuario,
                rol: user.Rol
            },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        let nombre = '';
        let datosAdicionales = {};

        switch (user.Rol) {
            case 'MEDICO':
                nombre = user.NombreMedico;
                datosAdicionales = { idMedico: user.IdMedico, idEspecialidad: user.IdEspecialidad };
                break;
            case 'PACIENTE':
                nombre = user.NombrePaciente;
                datosAdicionales = { idPaciente: user.IdPaciente, cedula: user.Cedula };
                break;
            case 'ADMIN':
                nombre = user.NombreAdmin;
                datosAdicionales = { idAdministrador: user.IdAdministrador, correo: user.Correo };
                break;
        }

        res.json({
            message: 'Login exitoso',
            token,
            usuario: {
                idUsuario: user.IdUsuario,
                usuario: user.Usuario,
                rol: user.Rol,
                nombre: nombre,
                foto: user.Foto, // CAMBIO: Se devuelve la foto al frontend
                ...datosAdicionales
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

// Verificar sesión
exports.verifySession = async (req, res) => {
    try {
        const userId = req.user.idUsuario;

        // SE AGREGÓ u.Foto a la consulta
        const users = await query(
            `SELECT u.IdUsuario, u.Usuario, u.Rol, u.Foto, 
                    u.IdMedico, u.IdPaciente, u.IdAdministrador,
                    m.Nombre as NombreMedico, m.IdEspecialidad,
                    p.Nombre as NombrePaciente, p.Cedula,
                    a.Nombre as NombreAdmin, a.Correo
             FROM usuarios u
             LEFT JOIN medicos m ON u.IdMedico = m.IdMedico
             LEFT JOIN pacientes p ON u.IdPaciente = p.IdPaciente
             LEFT JOIN administradores a ON u.IdAdministrador = a.IdAdministrador
             WHERE u.IdUsuario = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = users[0];
        let nombre = '';
        let datosAdicionales = {};

        switch (user.Rol) {
            case 'MEDICO':
                nombre = user.NombreMedico;
                datosAdicionales = { idMedico: user.IdMedico, idEspecialidad: user.IdEspecialidad };
                break;
            case 'PACIENTE':
                nombre = user.NombrePaciente;
                datosAdicionales = { idPaciente: user.IdPaciente, cedula: user.Cedula };
                break;
            case 'ADMIN':
                nombre = user.NombreAdmin;
                datosAdicionales = { idAdministrador: user.IdAdministrador, correo: user.Correo };
                break;
        }

        res.json({
            usuario: {
                idUsuario: user.IdUsuario,
                usuario: user.Usuario,
                rol: user.Rol,
                nombre: nombre,
                foto: user.Foto, // CAMBIO: Se devuelve la foto al verificar sesión
                ...datosAdicionales
            }
        });

    } catch (error) {
        console.error('Error al verificar sesión:', error);
        res.status(500).json({ error: 'Error al verificar sesión' });
    }
};

exports.getEspecialidadesPublic = async (req, res) => {
    try {
        const especialidades = await query('SELECT * FROM especialidades ORDER BY Descripcion');
        res.json(especialidades);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener especialidades' });
    }
};