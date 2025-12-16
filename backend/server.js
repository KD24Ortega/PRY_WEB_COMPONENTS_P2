const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite leer JSON en las peticiones

// Rutas
app.use('/users', require('./routes/users.routes'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Gestión de Usuarios - Clínica' });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🏥 Servidor de la Clínica activo en http://localhost:${PORT}`);
    console.log(`📡 API disponible en http://localhost:${PORT}/users`);
});