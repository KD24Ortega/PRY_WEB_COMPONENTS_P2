import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import apiService from '../../services/api.service.js';
import authService from '../../services/auth.service.js';
import '../shared/loading-spinner.js';

class MisRecetas extends LitElement {
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

        .recetas-container {
            display: grid;
            gap: 20px;
        }

        .receta-card {
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            border-left: 4px solid #00B377;
        }

        .receta-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .receta-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #E0E6ED;
        }

        .medicamento-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .medicamento-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            background: linear-gradient(135deg, rgba(0, 229, 160, 0.1) 0%, rgba(0, 179, 119, 0.1) 100%);
            color: #00B377;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }

        .medicamento-detalles {
            flex: 1;
        }

        .medicamento-nombre {
            font-size: 1.3rem;
            font-weight: 600;
            color: #2C5282;
            margin-bottom: 5px;
        }

        .medicamento-tipo {
            font-size: 0.9rem;
            color: #5A7C92;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .cantidad-badge {
            background: linear-gradient(135deg, #00E5A0 0%, #00B377 100%);
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 1rem;
        }

        .receta-body {
            display: grid;
            gap: 15px;
        }

        .info-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: #F8F9FA;
            border-radius: 8px;
        }

        .info-icon {
            color: #0066CC;
            font-size: 1.1rem;
        }

        .info-label {
            color: #5A7C92;
            font-size: 0.9rem;
            font-weight: 500;
            min-width: 100px;
        }

        .info-value {
            color: #2C5282;
            font-weight: 500;
        }

        .diagnostico-section {
            background: linear-gradient(135deg, rgba(0, 102, 204, 0.05) 0%, rgba(0, 217, 255, 0.05) 100%);
            padding: 15px;
            border-radius: 12px;
            border-left: 3px solid #0066CC;
            margin-top: 10px;
        }

        .diagnostico-label {
            font-size: 0.85rem;
            color: #5A7C92;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .diagnostico-texto {
            color: #2C5282;
            line-height: 1.5;
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
            .receta-header {
                flex-direction: column;
                gap: 15px;
                align-items: flex-start;
            }

            .medicamento-info {
                width: 100%;
            }
        }
    `;

    static properties = {
        loading: { type: Boolean },
        recetas: { type: Array }
    };

    constructor() {
        super();
        this.loading = true;
        this.recetas = [];
        this.loadRecetas();
    }

    async loadRecetas() {
        try {
            const currentUser = authService.getCurrentUser();
            
            if (currentUser.idPaciente) {
                this.recetas = await apiService.getRecetasByPaciente(currentUser.idPaciente);
                // Ordenar por fecha descendente
                this.recetas.sort((a, b) => new Date(b.FechaConsulta) - new Date(a.FechaConsulta));
            }
        } catch (error) {
            console.error('Error al cargar recetas:', error);
        } finally {
            this.loading = false;
        }
    }

    formatFecha(fecha) {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getTipoIcon(tipo) {
        const iconos = {
            'Tableta': '💊',
            'Cápsula': '💊',
            'Jarabe': '🧪',
            'Inyectable': '💉',
            'Crema': '🧴',
            'Gotas': '💧',
            'Inhalador': '🌬️',
            'Supositorio': '💊'
        };
        return iconos[tipo] || '💊';
    }

    render() {
        if (this.loading) {
            return html`<loading-spinner text="Cargando mis recetas..."></loading-spinner>`;
        }

        return html`
            <div class="page-header">
                <h1 class="page-title">
                    <i class="bi bi-prescription2"></i>
                    Mis Recetas Médicas
                </h1>
                <p class="page-subtitle">
                    Recetas y medicamentos prescritos por tus médicos
                </p>
            </div>

            ${this.recetas.length === 0 ? html`
                <div class="empty-state">
                    <div class="empty-icon">💊</div>
                    <div class="empty-text">
                        No tienes recetas médicas registradas
                    </div>
                </div>
            ` : html`
                <div class="recetas-container">
                    ${this.recetas.map(receta => html`
                        <div class="receta-card">
                            <div class="receta-header">
                                <div class="medicamento-info">
                                    <div class="medicamento-icon">
                                        ${this.getTipoIcon(receta.TipoMedicamento)}
                                    </div>
                                    <div class="medicamento-detalles">
                                        <div class="medicamento-nombre">
                                            ${receta.NombreMedicamento}
                                        </div>
                                        <div class="medicamento-tipo">
                                            <i class="bi bi-capsule"></i>
                                            ${receta.TipoMedicamento}
                                        </div>
                                    </div>
                                </div>
                                <div class="cantidad-badge">
                                    ${receta.Cantidad} unidades
                                </div>
                            </div>

                            <div class="receta-body">
                                <div class="info-row">
                                    <i class="info-icon bi bi-calendar-event"></i>
                                    <span class="info-label">Fecha:</span>
                                    <span class="info-value">${this.formatFecha(receta.FechaConsulta)}</span>
                                </div>

                                <div class="info-row">
                                    <i class="info-icon bi bi-person-badge"></i>
                                    <span class="info-label">Médico:</span>
                                    <span class="info-value">${receta.NombreMedico}</span>
                                </div>

                                <div class="diagnostico-section">
                                    <div class="diagnostico-label">
                                        <i class="bi bi-file-medical"></i>
                                        Diagnóstico asociado
                                    </div>
                                    <div class="diagnostico-texto">
                                        ${receta.Diagnostico}
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

customElements.define('mis-recetas', MisRecetas);