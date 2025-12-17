import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import authService from '../../services/auth.service.js';

class AppHeader extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .header {
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
            padding: 0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .navbar {
            padding: 1rem 2rem;
        }

        .navbar-brand {
            font-family: 'Poppins', sans-serif;
            font-size: 1.5rem;
            font-weight: 700;
            color: white !important;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .navbar-brand:hover {
            color: white !important;
            opacity: 0.9;
        }

        .navbar-toggler {
            border-color: rgba(255, 255, 255, 0.5);
        }

        .navbar-toggler-icon {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
            color: white;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: #0066CC;
            font-size: 1.1rem;
        }

        .user-details {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        .user-name {
            font-weight: 600;
            font-size: 0.95rem;
        }

        .user-role {
            font-size: 0.8rem;
            opacity: 0.9;
        }

        .role-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .role-admin {
            background: rgba(255, 193, 7, 0.2);
            color: #FFC107;
            border: 1px solid rgba(255, 193, 7, 0.5);
        }

        .role-medico {
            background: rgba(0, 229, 160, 0.2);
            color: #00E5A0;
            border: 1px solid rgba(0, 229, 160, 0.5);
        }

        .role-paciente {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .btn-logout {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.5);
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .btn-logout:hover {
            background: white;
            color: #0066CC;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .sidebar-toggle {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .sidebar-toggle:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
            .navbar {
                padding: 0.75rem 1rem;
            }

            .user-details {
                display: none;
            }

            .navbar-brand {
                font-size: 1.2rem;
            }
        }
    `;

    static properties = {
        currentUser: { type: Object }
    };

    constructor() {
        super();
        this.currentUser = authService.getCurrentUser();
    }

    handleLogout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            authService.logout();
            window.dispatchEvent(new CustomEvent('auth-changed'));
            this.showNotification('Sesión cerrada exitosamente', 'success');
        }
    }

    toggleSidebar() {
        window.dispatchEvent(new CustomEvent('sidebar-toggle', {
            detail: { collapsed: true }
        }));
    }

    getRoleText(rol) {
        switch (rol) {
            case 'ADMIN':
                return 'Administrador';
            case 'MEDICO':
                return 'Médico';
            case 'PACIENTE':
                return 'Paciente';
            default:
                return rol;
        }
    }

    getRoleClass(rol) {
        switch (rol) {
            case 'ADMIN':
                return 'role-admin';
            case 'MEDICO':
                return 'role-medico';
            case 'PACIENTE':
                return 'role-paciente';
            default:
                return '';
        }
    }

    getInitials(name) {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    showNotification(message, type = 'info') {
        const event = new CustomEvent('show-notification', {
            detail: { message, type },
            bubbles: true,
            composed: true
        });
        window.dispatchEvent(event);
    }

    render() {
        return html`
            <header class="header">
                <nav class="navbar navbar-expand-lg">
                    <div class="container-fluid">
                        <button class="sidebar-toggle d-lg-none me-2" @click=${this.toggleSidebar}>
                            <i class="bi bi-list"></i>
                        </button>
                        
                        <a class="navbar-brand" href="#">
                            <i class="bi bi-hospital"></i>
                            <span>Sistema Clínico</span>
                        </a>

                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                                data-bs-target="#navbarContent">
                            <span class="navbar-toggler-icon"></span>
                        </button>

                        <div class="collapse navbar-collapse" id="navbarContent">
                            <div class="ms-auto d-flex align-items-center gap-3">
                                <div class="user-info">
                                    <div class="user-avatar">
                                        ${this.getInitials(this.currentUser?.nombre)}
                                    </div>
                                    <div class="user-details">
                                        <div class="user-name">${this.currentUser?.nombre || 'Usuario'}</div>
                                        <span class="role-badge ${this.getRoleClass(this.currentUser?.rol)}">
                                            ${this.getRoleText(this.currentUser?.rol)}
                                        </span>
                                    </div>
                                </div>
                                <button class="btn btn-logout" @click=${this.handleLogout}>
                                    <i class="bi bi-box-arrow-right me-2"></i>
                                    Salir
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        `;
    }
}

customElements.define('app-header', AppHeader);