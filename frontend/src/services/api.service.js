/**
 * Servicio API - Maneja todas las peticiones HTTP al backend
 */

const API_URL = 'http://localhost:3000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    // === CONFIGURACIÓN DE AUTENTICACIÓN ===
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    getToken() {
        return this.token || localStorage.getItem('token');
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    // Método genérico para hacer peticiones
    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders()
        };

        try {
            const response = await fetch(url, config);
            if (response.status === 204) return null;

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Error en la petición');
            }
            return data;
        } catch (error) {
            console.error('Error en petición:', error);
            throw error;
        }
    }

    // === AUTENTICACIÓN ===
    async login(usuario, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ usuario, password })
        });
    }

    async register(data) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async verifySession() {
        return this.request('/auth/verify');
    }

    // === USUARIOS / PERFIL ===
    
    /**
     * Obtiene la lista de usuarios. 
     * Nota: La visualización de columnas (ocultar ID) se gestiona en el componente Manager.
     */
    async getUsuarios() {
        return this.request('/usuarios');
    }

    async getUsuariosStats() {
        return this.request('/usuarios/stats');
    }

    async updateUsuarioFoto(id, fotoBase64) {
        return this.request(`/usuarios/${id}/foto`, {
            method: 'PUT',
            body: JSON.stringify({ foto: fotoBase64 })
        });
    }

    // === ADMINISTRADORES ===
    
    /**
     * Obtiene la lista de administradores.
     * Nota: Para no mostrar el ID en la tabla, asegúrese de no incluir la columna 'id' en el render del componente.
     */
    async getAdministradores() {
        return this.request('/administradores');
    }

    async getAdministradorById(id) {
        return this.request(`/administradores/${id}`);
    }

    // === ESPECIALIDADES ===
    async getEspecialidades() {
        return this.request('/especialidades');
    }

    async getEspecialidadById(id) {
        return this.request(`/especialidades/${id}`);
    }

    async createEspecialidad(data) {
        return this.request('/especialidades', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateEspecialidad(id, data) {
        return this.request(`/especialidades/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteEspecialidad(id) {
        return this.request(`/especialidades/${id}`, {
            method: 'DELETE'
        });
    }

    // === MÉDICOS ===
    async getMedicos() {
        return this.request('/medicos');
    }

    async getMedicoById(id) {
        return this.request(`/medicos/${id}`);
    }

    // === PACIENTES ===
    async getPacientes() {
        return this.request('/pacientes');
    }

    async getPacienteById(id) {
        return this.request(`/pacientes/${id}`);
    }

    // === CONSULTAS ===
    async getConsultas() {
        return this.request('/consultas');
    }

    // === RECETAS ===
    async getRecetas() {
        return this.request('/recetas');
    }

    // === MEDICAMENTOS ===
    async getMedicamentos() {
        return this.request('/medicamentos');
    }
}

const apiService = new ApiService();
export default apiService;