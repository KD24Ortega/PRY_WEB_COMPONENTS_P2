import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import apiService from '../../services/api.service.js';
import authService from '../../services/auth.service.js';
import '../shared/loading-spinner.js';

class MisConsultas extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .page-header {
            margin-bottom: 30px;
        }

        .page-title {
            font-family: 'Poppins', sans-serif;
            font-size: 2rem;
            font-weight: 700;
            color: #0066CC;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }

        .page-subtitle {
            color: #5A7C92;
            font-size: 1rem;
        }

        .consultas-container {
            display: grid;
            gap: 20px;
        }

        .consulta-card {
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            border-left: 4px solid #0066CC;
        }

        .consulta-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .consulta-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #E0E6ED;
        }

        .consulta-fecha {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .fecha-principal {
            font-size: 1.2rem;
            font-weight: 600;
            color: #0066CC;
        }

        .hora-consulta {
            font-size: 0.9rem;
            color: #5A7C92;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .consulta-id {
            background: linear-gradient(135deg, rgba(0, 102, 204, 0.1) 0%, rgba(0, 217, 255, 0.1) 100%);
            color: #0066CC;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .consulta-body {
            display: grid;
            gap: 20px;
        }

        .info-section {
            display: flex;
            align-items: start;
            gap: 15px;
        }

        .info-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            background: linear-gradient(135deg, rgba(0, 102, 204, 0.1) 0%, rgba(0, 217, 255, 0.1) 100%);
            color: #0066CC;
            flex-shrink: 0;
        }

        .info-content {
            flex: 1;
        }

        .info-label {
            font-size: 0.85rem;
            color: #5A7C92;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 1rem;
            color: #2C5282;
            font-weight: 500;
        }

        .diagnostico-section {
            background: #F8F9FA;
            padding: 20px;
            border-radius: 12px;
            margin-top: 10px;
        }

        .diagnostico-label {
            font-size: 0.9rem;
            color: #5A7C92;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .diagnostico-texto {
            color: #2C5282;
            line-height: 1.6;
            font-size: 0.95rem;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .empty-icon {
            font-size: 4rem;
            margin-bottom: 15px;
            opacity: 0.5;
        }

        .empty-text {
            font-size: 1.1rem;
            color: #5A7C92;
            font-weight: 500;
        }

        @media (max-width: 768px) {
            .consulta-header {
                flex-direction: column;
                gap: 15px;
            }
        }
    `;

    static properties = {
        loading: { type: Boolean },
        consultas: { type: Array }
    };

    constructor() {
        super();
        this.loading = true;
        this.consultas = [];
        this.loadConsultas();
    }

    async loadConsultas() {
        try {
            const currentUser = authService.getCurrentUser();
            
            if (currentUser.idPaciente) {
                this.consultas = await apiService.getConsultasByPaciente(currentUser.idPaciente);
                // Ordenar por fecha descendente
                this.consultas.sort((a, b) => new Date(b.FechaConsulta) - new Date(a.FechaConsulta));
            }
        } catch (error) {
            console.error('Error al cargar consultas:', error);
        } finally {
            this.loading = false;
        }
    }

    formatFecha(fecha) {
        return new Date(fecha).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    render() {
        if (this.loading) {
            return html`<loading-spinner text="Cargando mis consultas..."></loading-spinner>`;
        }

        return html`
            <div class="page-header">
                <h1 class="page-title">
                    <i class="bi bi-calendar-heart"></i>
                    Mis Consultas Médicas
                </h1>
                <p class="page-subtitle">
                    Historial completo de tus consultas médicas
                </p>
            </div>

            ${this.consultas.length === 0 ? html`
                <div class="empty-state">
                    <div class="empty-icon">📅</div>
                    <div class="empty-text">
                        No tienes consultas médicas registradas
                    </div>
                </div>
            ` : html`
                <div class="consultas-container">
                    ${this.consultas.map(consulta => html`
                        <div class="consulta-card">
                            <div class="consulta-header">
                                <div class="consulta-fecha">
                                    <div class="fecha-principal">
                                        ${this.formatFecha(consulta.FechaConsulta)}
                                    </div>
                                    <div class="hora-consulta">
                                        <i class="bi bi-clock"></i>
                                        ${consulta.HI} - ${consulta.HF}
                                    </div>
                                </div>
                                <div class="consulta-id">
                                    Consulta #${consulta.IdConsulta}
                                </div>
                            </div>

                            <div class="consulta-body">
                                <div class="info-section">
                                    <div class="info-icon">
                                        <i class="bi bi-person-badge"></i>
                                    </div>
                                    <div class="info-content">
                                        <div class="info-label">Médico Tratante</div>
                                        <div class="info-value">${consulta.NombreMedico}</div>
                                    </div>
                                </div>

                                <div class="info-section">
                                    <div class="info-icon">
                                        <i class="bi bi-hospital"></i>
                                    </div>
                                    <div class="info-content">
                                        <div class="info-label">Especialidad</div>
                                        <div class="info-value">${consulta.Especialidad}</div>
                                    </div>
                                </div>

                                <div class="diagnostico-section">
                                    <div class="diagnostico-label">
                                        <i class="bi bi-file-medical"></i>
                                        Diagnóstico
                                    </div>
                                    <div class="diagnostico-texto">
                                        ${consulta.Diagnostico}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `)}
                </div>
            `}
        `;
    }
}

customElements.define('mis-consultas', MisConsultas);