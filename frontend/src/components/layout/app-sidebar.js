import { LitElement, html, css } from 'lit';
import authService from '../../services/auth.service.js';

class AppSidebar extends LitElement {
    static styles = css`
    
        :host {
            display: block;
        }

        .sidebar {
            width: 260px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
            padding: 20px 0;
            overflow-y: auto;
            transition: all 0.3s ease;
            position: sticky;
            top: 0;
            height: 100vh;
        }

        .sidebar.collapsed {
            width: 80px;
        }

        .sidebar-header {
            padding: 0 20px 20px;
            border-bottom: 2px solid #E0E6ED;
            margin-bottom: 20px;
        }

        .sidebar-title {
            font-family: 'Poppins', sans-serif;
            font-size: 1.1rem;
            font-weight: 600;
            color: #0066CC;
            margin: 0;
        }

        .sidebar.collapsed .sidebar-title {
            display: none;
        }

        .nav-menu {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .nav-item {
            margin-bottom: 5px;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 12px 20px;
            color: #5A7C92;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            font-weight: 500;
            border-left: 3px solid transparent;
        }

        .nav-link:hover {
            background: rgba(0, 102, 204, 0.05);
            color: #0066CC;
            border-left-color: #0066CC;
        }

        .nav-link.active {
            background: linear-gradient(90deg, rgba(0, 102, 204, 0.1) 0%, transparent 100%);
            color: #0066CC;
            border-left-color: #0066CC;
            font-weight: 600;
        }

        .nav-icon {
            font-size: 1.3rem;
            min-width: 24px;
            text-align: center;
        }

        .nav-text {
            flex: 1;
        }

        .sidebar.collapsed .nav-text {
            display: none;
        }

        .sidebar.collapsed .nav-link {
            justify-content: center;
            padding: 12px 10px;
        }

        .nav-section {
            padding: 15px 20px 5px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #95A5A6;
        }

        .sidebar.collapsed .nav-section {
            display: none;
        }

        /* Scrollbar personalizado */
        .sidebar::-webkit-scrollbar {
            width: 6px;
        }

        .sidebar::-webkit-scrollbar-track {
            background: transparent;
        }

        .sidebar::-webkit-scrollbar-thumb {
            background: rgba(0, 102, 204, 0.3);
            border-radius: 10px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 102, 204, 0.5);
        }

        @media (max-width: 992px) {
            .sidebar {
                position: fixed;
                left: -260px;
                z-index: 1050;
                height: 100vh;
            }

            .sidebar.mobile-open {
                left: 0;
            }
        }
    `;

    static properties = {
        collapsed: { type: Boolean },
        currentView: { type: String },
        userRole: { type: String },
        mobileOpen: { type: Boolean }
    };

    constructor() {
        super();
        this.collapsed = false;
        this.currentView = '';
        this.mobileOpen = false;
        const user = authService.getCurrentUser();
        this.userRole = user?.rol || '';
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('navigate', this.handleNavigate.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('navigate', this.handleNavigate.bind(this));
    }

    handleNavigate(e) {
        this.currentView = e.detail.view;
    }

    navigate(view) {
        this.currentView = view;
        window.dispatchEvent(new CustomEvent('navigate', {
            detail: { view }
        }));

        // Cerrar sidebar en móvil después de navegar
        if (window.innerWidth < 992) {
            this.mobileOpen = false;
        }
    }

    getMenuItems() {
        switch (this.userRole) {
            case 'ADMIN':
                return [
                    { section: 'Principal' },
                    { icon: 'bi-speedometer2', text: 'Dashboard', view: 'admin-dashboard' },
                    
                    { section: 'Gestión de Personal' },
                    { icon: 'bi-hospital', text: 'Especialidades', view: 'especialidades' },
                    { icon: 'bi-person-badge', text: 'Médicos', view: 'medicos' },
                    { icon: 'bi-people', text: 'Pacientes', view: 'pacientes' },
                    { icon: 'bi-shield-check', text: 'Administradores', view: 'administradores' },
                    
                    { section: 'Sistema' },
                    { icon: 'bi-capsule', text: 'Medicamentos', view: 'medicamentos' },
                    { icon: 'bi-person-gear', text: 'Usuarios', view: 'usuarios' },
                    
                    { section: 'Atención Médica' },
                    { icon: 'bi-calendar-check', text: 'Consultas', view: 'admin-consultas' },
                    { icon: 'bi-file-medical', text: 'Recetas', view: 'admin-recetas' }
                ];

            case 'MEDICO':
                return [
                    { section: 'Principal' },
                    { icon: 'bi-speedometer2', text: 'Dashboard', view: 'medico-dashboard' },
                    
                    { section: 'Atención Médica' },
                    { icon: 'bi-calendar-check', text: 'Mis Consultas', view: 'medico-consultas' },
                    { icon: 'bi-file-medical', text: 'Recetas', view: 'medico-recetas' }
                ];

            case 'PACIENTE':
                return [
                    { section: 'Principal' },
                    { icon: 'bi-speedometer2', text: 'Dashboard', view: 'paciente-dashboard' },
                    
                    { section: 'Mi Atención' },
                    { icon: 'bi-calendar-heart', text: 'Mis Consultas', view: 'paciente-consultas' },
                    { icon: 'bi-prescription2', text: 'Mis Recetas', view: 'paciente-recetas' }
                ];

            default:
                return [];
        }
    }

    renderMenuItem(item) {
        if (item.section) {
            return html`
                <div class="nav-section">${item.section}</div>
            `;
        }

        return html`
            <li class="nav-item">
                <a class="nav-link ${this.currentView === item.view ? 'active' : ''}"
                   @click=${() => this.navigate(item.view)}>
                    <i class="nav-icon bi ${item.icon}"></i>
                    <span class="nav-text">${item.text}</span>
                </a>
            </li>
        `;
    }

    render() {
        const menuItems = this.getMenuItems();

        return html`
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
    
            <aside class="sidebar ${this.collapsed ? 'collapsed' : ''} ${this.mobileOpen ? 'mobile-open' : ''}">
                <div class="sidebar-header">
                    <h3 class="sidebar-title">Menú</h3>
                </div>
                <nav>
                    <ul class="nav-menu">
                        ${menuItems.map(item => this.renderMenuItem(item))}
                    </ul>
                </nav>
            </aside>
        `;
    }
}

customElements.define('app-sidebar', AppSidebar);