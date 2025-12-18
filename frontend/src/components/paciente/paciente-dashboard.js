import { LitElement, html, css } from 'lit';
import apiService from '../../services/api.service.js';
import authService from '../../services/auth.service.js';
import '../shared/loading-spinner.js';

class PacienteDashboard extends LitElement {
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

        .patient-info {
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            margin-bottom: 30px;
        }

        .patient-info h2 {
            font-family: 'Poppins', sans-serif;
            font-size: 1.8rem;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .info-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .info-label {
            font-size: 0.85rem;
            opacity: 0.9;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 1.2rem;
            font-weight: 600;
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

        .health-card {
            background: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .imc-indicator {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            margin-top: 20px;
        }

        .imc-value {
            font-size: 3rem;
            font-weight: 700;
            color: #0066CC;
        }

        .imc-label {
            font-size: 1.1rem;
            color: #5A7C92;
            font-weight: 500;
        }

        .imc-status {
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
        }

        .imc-normal {
            background: rgba(0, 229, 160, 0.2);
            color: #00B377;
        }

        .imc-sobrepeso {
            background: rgba(255, 193, 7, 0.2);
            color: #FF8F00;
        }

        .imc-obesidad {
            background: rgba(220, 53, 69, 0.2);
            color: #C62828;
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
        consultas: { type: Array },
        recetas: { type: Array },
        pacienteInfo: { type: Object }
    };

    constructor() {
        super();
        this.loading = true;
        this.consultas = [];
        this.recetas = [];
        this.pacienteInfo = null;
        this.loadData();
    }

    async loadData() {
        try {
            const currentUser = authService.getCurrentUser();
            
            if (currentUser.idPaciente) {
                const [consultasData, recetasData, pacienteData] = await Promise.all([
                    apiService.getConsultasByPaciente(currentUser.idPaciente),
                    apiService.getRecetasByPaciente(currentUser.idPaciente),
                    apiService.getPacienteById(currentUser.idPaciente)
                ]);
                
                this.consultas = consultasData;
                this.recetas = recetasData;
                this.pacienteInfo = pacienteData;
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            this.loading = false;
        }
    }

    navigateTo(view) {
        window.dispatchEvent(new CustomEvent('navigate', {
            detail: { view }
        }));
    }

    calcularIMC() {
        if (!this.pacienteInfo || this.pacienteInfo.Estatura === 0) return null;
        
        const estaturaMetros = this.pacienteInfo.Estatura / 100;
        const imc = this.pacienteInfo.Peso / Math.pow(estaturaMetros, 2);
        return imc.toFixed(1);
    }

    getIMCEstado(imc) {
        if (!imc) return { texto: 'N/A', clase: '' };
        
        if (imc < 18.5) return { texto: 'Bajo peso', clase: 'imc-sobrepeso' };
        if (imc < 25) return { texto: 'Normal', clase: 'imc-normal' };
        if (imc < 30) return { texto: 'Sobrepeso', clase: 'imc-sobrepeso' };
        return { texto: 'Obesidad', clase: 'imc-obesidad' };
    }

    render() {
        const currentUser = authService.getCurrentUser();

        if (this.loading) {
            return html`
             <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
            <loading-spinner text="Cargando dashboard..."></loading-spinner>
            `;
        }

        const imc = this.calcularIMC();
        const imcEstado = this.getIMCEstado(imc);

        return html`
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
            <div class="dashboard-header">
                <h1 class="dashboard-title">
                    <i class="bi bi-person-heart me-2"></i>
                    Mi Panel de Salud
                </h1>
                <p class="dashboard-subtitle">
                    Bienvenido, ${currentUser?.nombre || 'Paciente'}
                </p>
            </div>

            ${this.pacienteInfo ? html`
                <div class="patient-info">
                    <h2>
                        <i class="bi bi-person-badge me-2"></i>
                        Mis Datos Personales
                    </h2>
                    <div class="info-grid">
                        <div class="info-card">
                            <div class="info-label">Cédula</div>
                            <div class="info-value">${this.pacienteInfo.Cedula}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Edad</div>
                            <div class="info-value">${this.pacienteInfo.Edad} años</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Género</div>
                            <div class="info-value">${this.pacienteInfo.Genero}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Estatura</div>
                            <div class="info-value">${this.pacienteInfo.Estatura} cm</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Peso</div>
                            <div class="info-value">${this.pacienteInfo.Peso} kg</div>
                        </div>
                    </div>
                </div>
            ` : ''}

            <div class="stats-grid">
                <div class="stat-card blue">
                    <div class="stat-header">
                        <div class="stat-label">Consultas</div>
                        <div class="stat-icon">
                            <i class="bi bi-calendar-check"></i>
                        </div>
                    </div>
                    <div class="stat-value">${this.consultas.length}</div>
                    <div class="stat-footer">
                        <i class="bi bi-graph-up"></i>
                        <span>Consultas médicas realizadas</span>
                    </div>
                </div>

                <div class="stat-card green">
                    <div class="stat-header">
                        <div class="stat-label">Recetas</div>
                        <div class="stat-icon">
                            <i class="bi bi-prescription2"></i>
                        </div>
                    </div>
                    <div class="stat-value">${this.recetas.length}</div>
                    <div class="stat-footer">
                        <i class="bi bi-capsule"></i>
                        <span>Recetas médicas activas</span>
                    </div>
                </div>

                <div class="stat-card purple">
                    <div class="stat-header">
                        <div class="stat-label">Médicos</div>
                        <div class="stat-icon">
                            <i class="bi bi-hospital"></i>
                        </div>
                    </div>
                    <div class="stat-value">${new Set(this.consultas.map(c => c.IdMedico)).size}</div>
                    <div class="stat-footer">
                        <i class="bi bi-person-badge"></i>
                        <span>Médicos que me han atendido</span>
                    </div>
                </div>
            </div>

            <div class="quick-actions">
                <h2 class="section-title">
                    <i class="bi bi-lightning me-2"></i>
                    Accesos Rápidos
                </h2>
                <div class="actions-grid">
                    <div class="action-btn" @click=${() => this.navigateTo('paciente-consultas')}>
                        <span class="action-icon">📅</span>
                        <span class="action-text">Mis Consultas</span>
                    </div>
                    <div class="action-btn" @click=${() => this.navigateTo('paciente-recetas')}>
                        <span class="action-icon">💊</span>
                        <span class="action-text">Mis Recetas</span>
                    </div>
                </div>
            </div>

            ${imc ? html`
                <div class="health-card">
                    <h2 class="section-title">
                        <i class="bi bi-heart-pulse me-2"></i>
                        Indicador de Masa Corporal (IMC)
                    </h2>
                    <div class="imc-indicator">
                        <div class="imc-value">${imc}</div>
                        <div class="imc-label">Tu IMC actual</div>
                        <div class="imc-status ${imcEstado.clase}">
                            ${imcEstado.texto}
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }
}

customElements.define('paciente-dashboard', PacienteDashboard);