import apiService from './api.service.js';

class AuthService {
    constructor() {
        this.currentUser = null;
        this.loadUserFromStorage();
    }

    saveUserToStorage(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
    }

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

    clearAuth() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUser = null;
        apiService.clearToken();
    }

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

    async register(data) {
        try {
            return await apiService.register(data);
        } catch (error) {
            throw error;
        }
    }

    logout() {
        this.clearAuth();
    }

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

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null && apiService.getToken() !== null;
    }

    hasRole(rol) {
        return this.currentUser && this.currentUser.rol === rol;
    }

    hasAnyRole(...roles) {
        return this.currentUser && roles.includes(this.currentUser.rol);
    }
}

const authService = new AuthService();
export default authService;