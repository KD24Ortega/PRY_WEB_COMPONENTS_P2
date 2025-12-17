const mysql = require('mysql2');

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'ProyectoVeris_Clinica',
    charset: 'utf8mb4'
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err);
        process.exit(1);
    }
    console.log('✅ Conexión exitosa a la base de datos MySQL');
});

// Función helper para ejecutar queries con promesas
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = { connection, query };