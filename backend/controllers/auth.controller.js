const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const jwtConfig = require('../config/jwt.config');

// Inicializar administrador por defecto
exports.initializeAdmin = async () => {
    try {
        // Verificar si ya existe el admin
        const existingAdmin = await query(
            'SELECT * FROM usuarios WHERE Usuario = ?',
            ['admin']
        );

        if (existingAdmin.length > 0) {
            console.log('✅ Administrador por defecto ya existe');
            return;
        }

        // Crear administrador en tabla administradores
        const adminData = await query(
            'INSERT INTO administradores (Nombre, Correo) VALUES (?, ?)',
            ['Administrador Sistema', 'admin@clinica.com']
        );

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash('123', 10);

        // Crear usuario administrador
        await query(
            `INSERT INTO usuarios (Usuario, PasswordHash, Rol, IdAdministrador) 
             VALUES (?, ?, ?, ?)`,
            ['admin', hashedPassword, 'ADMIN', adminData.insertId]
        );

        console.log('✅ Administrador por defecto creado exitosamente');
        console.log('   Usuario: admin');
        console.log('   Contraseña: 123');
    } catch (error) {
        console.error('❌ Error al crear administrador por defecto:', error);
    }
};

// Registro de usuarios
exports.register = async (req, res) => {
    try {
        const { usuario, password, rol, datosPersonales } = req.body;

        // Validaciones básicas
        if (!usuario || !password || !rol) {
            return res.status(400).json({ 
                error: 'Usuario, contraseña y rol son requeridos' 
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await query(
            'SELECT * FROM usuarios WHERE Usuario = ?',
            [usuario]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ 
                error: 'El nombre de usuario ya está en uso' 
            });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        let relacionId = null;

        // Crear registro según el rol
        switch (rol) {
            case 'MEDICO':
                if (!datosPersonales.nombre || !datosPersonales.idEspecialidad) {
                    return res.status(400).json({ 
                        error: 'Datos incompletos para médico' 
                    });
                }
                
                const medico = await query(
                    'INSERT INTO medicos (Nombre, IdEspecialidad, Foto) VALUES (?, ?, ?)',
                    [
                        datosPersonales.nombre,
                        datosPersonales.idEspecialidad,
                        datosPersonales.foto || 'default.jpg'
                    ]
                );
                relacionId = medico.insertId;

                await query(
                    `INSERT INTO usuarios (Usuario, PasswordHash, Rol, IdMedico) 
                     VALUES (?, ?, ?, ?)`,
                    [usuario, hashedPassword, rol, relacionId]
                );
                break;

            case 'PACIENTE':
                if (!datosPersonales.nombre || !datosPersonales.cedula) {
                    return res.status(400).json({ 
                        error: 'Datos incompletos para paciente' 
                    });
                }

                const paciente = await query(
                    `INSERT INTO pacientes (Nombre, Cedula, Edad, Genero, Estatura, Peso, Foto) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        datosPersonales.nombre,
                        datosPersonales.cedula,
                        datosPersonales.edad || 0,
                        datosPersonales.genero || 'No especificado',
                        datosPersonales.estatura || 0,
                        datosPersonales.peso || 0,
                        datosPersonales.foto || 'default.jpg'
                    ]
                );
                relacionId = paciente.insertId;

                await query(
                    `INSERT INTO usuarios (Usuario, PasswordHash, Rol, IdPaciente) 
                     VALUES (?, ?, ?, ?)`,
                    [usuario, hashedPassword, rol, relacionId]
                );
                break;

            case 'ADMIN':
                const admin = await query(
                    'INSERT INTO administradores (Nombre, Correo) VALUES (?, ?)',
                    [
                        datosPersonales.nombre,
                        datosPersonales.correo
                    ]
                );
                relacionId = admin.insertId;

                await query(
                    `INSERT INTO usuarios (Usuario, PasswordHash, Rol, IdAdministrador) 
                     VALUES (?, ?, ?, ?)`,
                    [usuario, hashedPassword, rol, relacionId]
                );
                break;

            default:
                return res.status(400).json({ error: 'Rol no válido' });
        }

        res.status(201).json({ 
            message: 'Usuario registrado exitosamente',
            usuario: usuario,
            rol: rol
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { usuario, password } = req.body;

        // Validaciones
        if (!usuario || !password) {
            return res.status(400).json({ 
                error: 'Usuario y contraseña son requeridos' 
            });
        }

        // Buscar usuario
        const users = await query(
            `SELECT u.*, 
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

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.PasswordHash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                idUsuario: user.IdUsuario,
                usuario: user.Usuario,
                rol: user.Rol,
                idMedico: user.IdMedico,
                idPaciente: user.IdPaciente,
                idAdministrador: user.IdAdministrador
            },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        // Preparar datos del usuario
        let nombre = '';
        let datosAdicionales = {};

        switch (user.Rol) {
            case 'MEDICO':
                nombre = user.NombreMedico;
                datosAdicionales = {
                    idMedico: user.IdMedico,
                    idEspecialidad: user.IdEspecialidad
                };
                break;
            case 'PACIENTE':
                nombre = user.NombrePaciente;
                datosAdicionales = {
                    idPaciente: user.IdPaciente,
                    cedula: user.Cedula
                };
                break;
            case 'ADMIN':
                nombre = user.NombreAdmin;
                datosAdicionales = {
                    idAdministrador: user.IdAdministrador,
                    correo: user.Correo
                };
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

        const users = await query(
            `SELECT u.IdUsuario, u.Usuario, u.Rol, u.IdMedico, u.IdPaciente, u.IdAdministrador,
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
                datosAdicionales = {
                    idMedico: user.IdMedico,
                    idEspecialidad: user.IdEspecialidad
                };
                break;
            case 'PACIENTE':
                nombre = user.NombrePaciente;
                datosAdicionales = {
                    idPaciente: user.IdPaciente,
                    cedula: user.Cedula
                };
                break;
            case 'ADMIN':
                nombre = user.NombreAdmin;
                datosAdicionales = {
                    idAdministrador: user.IdAdministrador,
                    correo: user.Correo
                };
                break;
        }

        res.json({
            usuario: {
                idUsuario: user.IdUsuario,
                usuario: user.Usuario,
                rol: user.Rol,
                nombre: nombre,
                ...datosAdicionales
            }
        });

    } catch (error) {
        console.error('Error al verificar sesión:', error);
        res.status(500).json({ error: 'Error al verificar sesión' });
    }
};

// Obtener especialidades (endpoint público para registro)
exports.getEspecialidadesPublic = async (req, res) => {
    try {
        const especialidades = await query('SELECT * FROM especialidades ORDER BY Descripcion');
        res.json(especialidades);
    } catch (error) {
        console.error('Error al obtener especialidades:', error);
        res.status(500).json({ error: 'Error al obtener especialidades' });
    }
};