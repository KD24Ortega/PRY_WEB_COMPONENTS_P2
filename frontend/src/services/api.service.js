/**
 * Servicio API - Maneja todas las peticiones HTTP al backend
 */

const API_URL = 'http://localhost:3000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    // Configurar token
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    // Obtener token
    getToken() {
        return this.token || localStorage.getItem('token');
    }

    // Limpiar token
    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    // Headers con autenticación
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

    async createMedico(data) {
        return this.request('/medicos', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateMedico(id, data) {
        return this.request(`/medicos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteMedico(id) {
        return this.request(`/medicos/${id}`, {
            method: 'DELETE'
        });
    }

    // === PACIENTES ===
    async getPacientes() {
        return this.request('/pacientes');
    }

    async getPacienteById(id) {
        return this.request(`/pacientes/${id}`);
    }

    async createPaciente(data) {
        return this.request('/pacientes', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updatePaciente(id, data) {
        return this.request(`/pacientes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deletePaciente(id) {
        return this.request(`/pacientes/${id}`, {
            method: 'DELETE'
        });
    }

    // === ADMINISTRADORES ===
    async getAdministradores() {
        return this.request('/administradores');
    }

    async getAdministradorById(id) {
        return this.request(`/administradores/${id}`);
    }

    async createAdministrador(data) {
        return this.request('/administradores', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateAdministrador(id, data) {
        return this.request(`/administradores/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteAdministrador(id) {
        return this.request(`/administradores/${id}`, {
            method: 'DELETE'
        });
    }

    // === USUARIOS ===
    async getUsuarios() {
        return this.request('/usuarios');
    }

    async getUsuarioById(id) {
        return this.request(`/usuarios/${id}`);
    }

    async getUsuariosByRole(rol) {
        return this.request(`/usuarios/rol/${rol}`);
    }

    async getUsuariosStats() {
        return this.request('/usuarios/stats');
    }

    async changePassword(id, currentPassword, newPassword) {
        return this.request(`/usuarios/${id}/change-password`, {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    }

    async resetPassword(id, newPassword) {
        return this.request(`/usuarios/${id}/reset-password`, {
            method: 'POST',
            body: JSON.stringify({ newPassword })
        });
    }

    async updateUsername(id, newUsername) {
        return this.request(`/usuarios/${id}/username`, {
            method: 'PUT',
            body: JSON.stringify({ newUsername })
        });
    }

    async deleteUsuario(id) {
        return this.request(`/usuarios/${id}`, {
            method: 'DELETE'
        });
    }

    // === MEDICAMENTOS ===
    async getMedicamentos() {
        return this.request('/medicamentos');
    }

    async getMedicamentoById(id) {
        return this.request(`/medicamentos/${id}`);
    }

    async createMedicamento(data) {
        return this.request('/medicamentos', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateMedicamento(id, data) {
        return this.request(`/medicamentos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteMedicamento(id) {
        return this.request(`/medicamentos/${id}`, {
            method: 'DELETE'
        });
    }

    // === CONSULTAS ===
    async getConsultas() {
        return this.request('/consultas');
    }

    async getConsultaById(id) {
        return this.request(`/consultas/${id}`);
    }

    async getConsultasByMedico(idMedico) {
        return this.request(`/consultas/medico/${idMedico}`);
    }

    async getConsultasByPaciente(idPaciente) {
        return this.request(`/consultas/paciente/${idPaciente}`);
    }

    async createConsulta(data) {
        return this.request('/consultas', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateConsulta(id, data) {
        return this.request(`/consultas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteConsulta(id) {
        return this.request(`/consultas/${id}`, {
            method: 'DELETE'
        });
    }

    // === RECETAS ===
    async getRecetas() {
        return this.request('/recetas');
    }

    async getRecetasByConsulta(idConsulta) {
        return this.request(`/recetas/consulta/${idConsulta}`);
    }

    async getRecetasByPaciente(idPaciente) {
        return this.request(`/recetas/paciente/${idPaciente}`);
    }

    async createReceta(data) {
        return this.request('/recetas', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateReceta(id, data) {
        return this.request(`/recetas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteReceta(id) {
        return this.request(`/recetas/${id}`, {
            method: 'DELETE'
        });
    }
}

// Exportar instancia única
const apiService = new ApiService();
export default apiService;