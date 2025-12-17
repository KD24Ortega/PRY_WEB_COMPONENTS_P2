const express = require('express');
const cors = require('cors');
const authController = require('./controllers/auth.controller');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas públicas
app.use('/api/auth', require('./routes/auth.routes'));

// Rutas protegidas
app.use('/api/especialidades', require('./routes/especialidades.routes'));
app.use('/api/medicos', require('./routes/medicos.routes'));
app.use('/api/pacientes', require('./routes/pacientes.routes'));
app.use('/api/administradores', require('./routes/administradores.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/medicamentos', require('./routes/medicamentos.routes'));
app.use('/api/consultas', require('./routes/consultas.routes'));
app.use('/api/recetas', require('./routes/recetas.routes'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: '🏥 API Sistema Clínico - ProyectoVeris',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            especialidades: '/api/especialidades',
            medicos: '/api/medicos',
            pacientes: '/api/pacientes',
            administradores: '/api/administradores',
            usuarios: '/api/usuarios',
            medicamentos: '/api/medicamentos',
            consultas: '/api/consultas',
            recetas: '/api/recetas'
        }
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = 3000;

// Iniciar servidor
app.listen(PORT, async () => {
    console.log('═══════════════════════════════════════════════════');
    console.log('🏥  SISTEMA CLÍNICO - PROYECTOVERIS');
    console.log('═══════════════════════════════════════════════════');
    console.log(`🚀  Servidor activo en http://localhost:${PORT}`);
    console.log(`📡  API disponible en http://localhost:${PORT}/api`);
    console.log('═══════════════════════════════════════════════════');
    
    // Inicializar administrador por defecto
    await authController.initializeAdmin();
});