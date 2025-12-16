/**
 * Archivo principal de la aplicación
 * Importa y registra todos los Web Components
 */

// Importar todos los componentes
import './components/user-app.js';
import './components/user-form.js';
import './components/user-list.js';
import './components/user-item.js';
import './components/confirm-dialog.js';

// Mensaje de inicialización en consola
console.log('🏥 Sistema de Gestión de Usuarios - Clínica');
console.log('✅ Todos los componentes han sido cargados correctamente');

// Verificar conexión con el backend
fetch('http://localhost:3000/')
    .then(response => response.json())
    .then(data => {
        console.log('✅ Conexión con el backend:', data.message);
    })
    .catch(error => {
        console.error('❌ Error al conectar con el backend:', error);
        console.log('⚠️ Asegúrate de que el servidor esté corriendo en http://localhost:3000');
    });