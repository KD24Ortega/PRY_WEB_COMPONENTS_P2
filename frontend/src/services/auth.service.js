/**
 * Servicio de Autenticación
 */

import apiService from './api.service.js';

class AuthService {
    constructor() {
        this.currentUser = null;
        this.loadUserFromStorage();
    }

    // Guardar usuario en localStorage
    saveUserToStorage(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
    }

    // Cargar usuario desde localStorage
    loadUserFromStorage() {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            try {
                this.currentUser = JSON.parse(userStr);
            } catch (error) {
                console.error('Error al cargar usuario:', error);
                this.clearAuth();
            }
        }
    }

    // Limpiar autenticación
    clearAuth() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUser = null;
        apiService.clearToken();
    }

    // Login
    async login(usuario, password) {
        try {
            const response = await apiService.login(usuario, password);
            
            if (response.token) {
                apiService.setToken(response.token);
                this.saveUserToStorage(response.usuario);
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Registro
    async register(data) {
        try {
            return await apiService.register(data);
        } catch (error) {
            throw error;
        }
    }

    // Logout
    logout() {
        this.clearAuth();
    }

    // Verificar sesión
    async verifySession() {
        try {
            const response = await apiService.verifySession();
            if (response.usuario) {
                this.saveUserToStorage(response.usuario);
            }
            return response;
        } catch (error) {
            this.clearAuth();
            throw error;
        }
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar si está autenticado
    isAuthenticated() {
        return this.currentUser !== null && apiService.getToken() !== null;
    }

    // Verificar rol
    hasRole(rol) {
        return this.currentUser && this.currentUser.rol === rol;
    }

    // Verificar múltiples roles
    hasAnyRole(...roles) {
        return this.currentUser && roles.includes(this.currentUser.rol);
    }
}

// Exportar instancia única
const authService = new AuthService();
export default authService;