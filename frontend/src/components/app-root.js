import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import authService from '../services/auth.service.js';

import './layout/app-header.js';
import './layout/app-sidebar.js';
import './layout/app-footer.js';
import './auth/login-component.js';
import './auth/register-component.js';

import './admin/admin-dashboard.js';
import './admin/especialidades-manager.js';
import './admin/medicos-manager.js';
import './admin/pacientes-manager.js';
import './admin/medicamentos-manager.js';
import './admin/usuarios-manager.js';
import './admin/administradores-manager.js';
import './admin/admin-consultas.js';
import './admin/admin-recetas.js';

import './medico/medico-dashboard.js';
import './medico/medico-consultas.js';
import './medico/medico-recetas.js';

import './paciente/paciente-dashboard.js';
import './paciente/mis-consultas.js';
import './paciente/mis-recetas.js';

class AppRoot extends LitElement {
    static styles = css`
        :host {
            display: block;
            min-height: 100vh;
        }

        .app-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        .auth-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        .main-layout {
            display: flex;
            flex: 1;
        }

        .content-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .main-content {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
        }

        @media (max-width: 768px) {
            .main-content {
                padding: 15px;
            }
        }
    `;

    static properties = {
        currentUser: { type: Object },
        currentView: { type: String },
        isAuthenticated: { type: Boolean },
        sidebarCollapsed: { type: Boolean }
    };

    constructor() {
        super();
        this.currentUser = null;
        this.currentView = 'login';
        this.isAuthenticated = false;
        this.sidebarCollapsed = false;
        this.checkAuthentication();
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('auth-changed', this.handleAuthChange.bind(this));
        window.addEventListener('navigate', this.handleNavigation.bind(this));
        window.addEventListener('sidebar-toggle', this.handleSidebarToggle.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('auth-changed', this.handleAuthChange.bind(this));
        window.removeEventListener('navigate', this.handleNavigation.bind(this));
        window.removeEventListener('sidebar-toggle', this.handleSidebarToggle.bind(this));
    }

    checkAuthentication() {
        this.isAuthenticated = authService.isAuthenticated();
        this.currentUser = authService.getCurrentUser();
        
        if (this.isAuthenticated && this.currentUser) {
            this.currentView = this.getDefaultView();
        } else {
            this.currentView = 'login';
        }
    }

    getDefaultView() {
        if (!this.currentUser) return 'login';
        
        switch (this.currentUser.rol) {
            case 'ADMIN':
                return 'admin-dashboard';
            case 'MEDICO':
                return 'medico-dashboard';
            case 'PACIENTE':
                return 'paciente-dashboard';
            default:
                return 'login';
        }
    }

    handleAuthChange(e) {
        this.checkAuthentication();
    }

    handleNavigation(e) {
        this.currentView = e.detail.view;
    }

    handleSidebarToggle(e) {
        this.sidebarCollapsed = e.detail.collapsed;
    }

    renderContent() {
        if (!this.isAuthenticated) {
            if (this.currentView === 'register') {
                return html`<register-component></register-component>`;
            }
            return html`<login-component></login-component>`;
        }

        switch (this.currentView) {
            case 'admin-dashboard':
                return html`<admin-dashboard></admin-dashboard>`;
            case 'especialidades':
                return html`<especialidades-manager></especialidades-manager>`;
            case 'medicos':
                return html`<medicos-manager></medicos-manager>`;
            case 'pacientes':
                return html`<pacientes-manager></pacientes-manager>`;
            case 'medicamentos':
                return html`<medicamentos-manager></medicamentos-manager>`;
            case 'usuarios':
                return html`<usuarios-manager></usuarios-manager>`;
            case 'administradores':
                return html`<administradores-manager></administradores-manager>`;
            case 'admin-consultas':
                return html`<admin-consultas></admin-consultas>`;
            case 'admin-recetas':
                 return html`<admin-recetas></admin-recetas>`;

            case 'medico-dashboard':
                return html`<medico-dashboard></medico-dashboard>`;
            case 'medico-consultas':
                return html`<medico-consultas></medico-consultas>`;
            case 'medico-recetas':
                return html`<medico-recetas></medico-recetas>`;

            case 'paciente-dashboard':
                return html`<paciente-dashboard></paciente-dashboard>`;
            case 'paciente-consultas':
                return html`<mis-consultas></mis-consultas>`;
            case 'paciente-recetas':
                return html`<mis-recetas></mis-recetas>`;

            default:
                return html`<div>Vista no encontrada: ${this.currentView}</div>`;
        }
    }

    render() {
        if (!this.isAuthenticated) {
            return html`
                <div class="app-container">
                    <div class="auth-container">
                        ${this.renderContent()}
                    </div>
                </div>
            `;
        }

        return html`
            <div class="app-container">
                <app-header></app-header>
                <div class="main-layout">
                    <app-sidebar .collapsed=${this.sidebarCollapsed}></app-sidebar>
                    <div class="content-wrapper">
                        <main class="main-content">
                            ${this.renderContent()}
                        </main>
                        <app-footer></app-footer>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('app-root', AppRoot);