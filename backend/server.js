const express = require('express');
const cors = require('cors');
const path = require('path');
const authController = require('./controllers/auth.controller');

const app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/especialidades', require('./routes/especialidades.routes'));
app.use('/api/medicos', require('./routes/medicos.routes'));
app.use('/api/pacientes', require('./routes/pacientes.routes'));
app.use('/api/administradores', require('./routes/administradores.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/medicamentos', require('./routes/medicamentos.routes'));
app.use('/api/consultas', require('./routes/consultas.routes'));
app.use('/api/recetas', require('./routes/recetas.routes'));

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
    },
    uploads: '/uploads'
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err instanceof require('multer').MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 2MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', async () => {
  console.log('═══════════════════════════════════════════════════');
  console.log('🏥  SISTEMA CLÍNICO - PROYECTOVERIS');
  console.log('═══════════════════════════════════════════════════');
  console.log(`✅ Servidor activo en http://0.0.0.0:${PORT}`);
  console.log(`✅ API disponible en http://10.40.32.75:${PORT}/api`);
  console.log(`✅ Uploads disponibles en http://10.40.32.75:${PORT}/uploads`);
  console.log('═══════════════════════════════════════════════════');

  await authController.initializeAdmin();
});

module.exports = app;
