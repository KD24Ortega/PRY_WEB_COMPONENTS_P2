import { LitElement, html, css } from 'lit';
import apiService from '../../services/api.service.js';
import authService from '../../services/auth.service.js';
import '../shared/loading-spinner.js';

class AdminDashboard extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .dashboard-header {
            margin-bottom: 30px;
        }

        .dashboard-title {
            font-family: 'Poppins', sans-serif;
            font-size: 2rem;
            font-weight: 700;
            color: #0066CC;
            margin-bottom: 10px;
        }

        .dashboard-subtitle {
            color: #5A7C92;
            font-size: 1.1rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(180deg, var(--accent-color) 0%, var(--primary-color) 100%);
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .stat-card.blue::before {
            --accent-color: #00D9FF;
            --primary-color: #0066CC;
        }

        .stat-card.green::before {
            --accent-color: #00E5A0;
            --primary-color: #00B377;
        }

        .stat-card.orange::before {
            --accent-color: #FFB84D;
            --primary-color: #FF9800;
        }

        .stat-card.purple::before {
            --accent-color: #9C27B0;
            --primary-color: #7B1FA2;
        }

        .stat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }

        .stat-card.blue .stat-icon {
            background: linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(0, 102, 204, 0.1) 100%);
            color: #0066CC;
        }

        .stat-card.green .stat-icon {
            background: linear-gradient(135deg, rgba(0, 229, 160, 0.1) 0%, rgba(0, 179, 119, 0.1) 100%);
            color: #00B377;
        }

        .stat-card.orange .stat-icon {
            background: linear-gradient(135deg, rgba(255, 184, 77, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%);
            color: #FF9800;
        }

        .stat-card.purple .stat-icon {
            background: linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(123, 31, 162, 0.1) 100%);
            color: #7B1FA2;
        }

        .stat-label {
            font-size: 0.9rem;
            color: #5A7C92;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2C5282;
            line-height: 1;
        }

        .stat-footer {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-top: 10px;
            font-size: 0.85rem;
            color: #95A5A6;
        }

        .quick-actions {
            background: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            margin-bottom: 30px;
        }

        .section-title {
            font-family: 'Poppins', sans-serif;
            font-size: 1.5rem;
            font-weight: 600;
            color: #2C5282;
            margin-bottom: 20px;
        }

        .actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .action-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px 20px;
            background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);
            border: 2px solid #E0E6ED;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            color: #2C5282;
        }

        .action-btn:hover {
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
            border-color: #0066CC;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2);
        }

        .action-icon {
            font-size: 1.5rem;
        }

        .action-text {
            font-weight: 600;
            font-size: 0.95rem;
        }

        .activity-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .activity-item {
            padding: 15px;
            border-bottom: 1px solid #E0E6ED;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .activity-item:last-child {
            border-bottom: none;
        }

        .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            background: linear-gradient(135deg, rgba(0, 102, 204, 0.1) 0%, rgba(0, 217, 255, 0.1) 100%);
            color: #0066CC;
        }

        .activity-content {
            flex: 1;
        }

        .activity-title {
            font-weight: 600;
            color: #2C5282;
            margin-bottom: 3px;
        }

        .activity-time {
            font-size: 0.85rem;
            color: #95A5A6;
        }

        @media (max-width: 768px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }

            .actions-grid {
                grid-template-columns: 1fr;
            }
        }
    `;

    static properties = {
        loading: { type: Boolean },
        stats: { type: Object }
    };

    constructor() {
        super();
        this.loading = true;
        this.stats = {
            total: 0,
            medicos: 0,
            pacientes: 0,
            administradores: 0
        };
        this.loadStats();
    }

    async loadStats() {
        try {
            const statsData = await apiService.getUsuariosStats();
            this.stats = statsData;
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            this.loading = false;
        }
    }

    navigateTo(view) {
        window.dispatchEvent(new CustomEvent('navigate', {
            detail: { view }
        }));
    }

    render() {
        const currentUser = authService.getCurrentUser();

        if (this.loading) {
            return html`
             <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
            <loading-spinner text="Cargando dashboard..."></loading-spinner>`;
        }

        return html`
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
            <div class="dashboard-header">
                <h1 class="dashboard-title">
                    <i class="bi bi-speedometer2 me-2"></i>
                    Dashboard Administrativo
                </h1>
                <p class="dashboard-subtitle">
                    Bienvenido, ${currentUser?.nombre || 'Administrador'}
                </p>
            </div>

            <div class="stats-grid">
                <div class="stat-card blue">
                    <div class="stat-header">
                        <div class="stat-label">Total Usuarios</div>
                        <div class="stat-icon">
                            <i class="bi bi-people"></i>
                        </div>
                    </div>
                    <div class="stat-value">${this.stats.total}</div>
                    <div class="stat-footer">
                        <i class="bi bi-graph-up"></i>
                        <span>Usuarios registrados</span>
                    </div>
                </div>

                <div class="stat-card green">
                    <div class="stat-header">
                        <div class="stat-label">Médicos</div>
                        <div class="stat-icon">
                            <i class="bi bi-person-badge"></i>
                        </div>
                    </div>
                    <div class="stat-value">${this.stats.medicos}</div>
                    <div class="stat-footer">
                        <i class="bi bi-hospital"></i>
                        <span>Personal médico</span>
                    </div>
                </div>

                <div class="stat-card orange">
                    <div class="stat-header">
                        <div class="stat-label">Pacientes</div>
                        <div class="stat-icon">
                            <i class="bi bi-heart-pulse"></i>
                        </div>
                    </div>
                    <div class="stat-value">${this.stats.pacientes}</div>
                    <div class="stat-footer">
                        <i class="bi bi-clipboard-heart"></i>
                        <span>Pacientes activos</span>
                    </div>
                </div>

                <div class="stat-card purple">
                    <div class="stat-header">
                        <div class="stat-label">Administradores</div>
                        <div class="stat-icon">
                            <i class="bi bi-shield-check"></i>
                        </div>
                    </div>
                    <div class="stat-value">${this.stats.administradores}</div>
                    <div class="stat-footer">
                        <i class="bi bi-gear"></i>
                        <span>Personal administrativo</span>
                    </div>
                </div>
            </div>

            <div class="quick-actions">
                <h2 class="section-title">
                    <i class="bi bi-lightning me-2"></i>
                    Accesos Rápidos
                </h2>
                <div class="actions-grid">
                    <div class="action-btn" @click=${() => this.navigateTo('especialidades')}>
                        <span class="action-icon">🏥</span>
                        <span class="action-text">Especialidades</span>
                    </div>
                    <div class="action-btn" @click=${() => this.navigateTo('medicos')}>
                        <span class="action-icon">👨‍⚕️</span>
                        <span class="action-text">Médicos</span>
                    </div>
                    <div class="action-btn" @click=${() => this.navigateTo('pacientes')}>
                        <span class="action-icon">🧑</span>
                        <span class="action-text">Pacientes</span>
                    </div>
                    <div class="action-btn" @click=${() => this.navigateTo('medicamentos')}>
                        <span class="action-icon">💊</span>
                        <span class="action-text">Medicamentos</span>
                    </div>
                    <div class="action-btn" @click=${() => this.navigateTo('usuarios')}>
                        <span class="action-icon">👥</span>
                        <span class="action-text">Usuarios</span>
                    </div>
                    <div class="action-btn" @click=${() => this.navigateTo('admin-consultas')}>
                        <span class="action-icon">📅</span>
                        <span class="action-text">Consultas</span>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('admin-dashboard', AdminDashboard);