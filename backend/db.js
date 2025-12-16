const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', // Coloca aquí tu contraseña de MySQL
    database: 'gestion_usuarios'
});

connection.connect(err => {
    if (err) {
        console.error('❌ Error al conectar con MySQL:', err);
        throw err;
    }
    console.log('✔ Conectado exitosamente a MySQL');
});

module.exports = connection;