import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import apiService from '../../services/api.service.js';
import authService from '../../services/auth.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class ConsultasManager extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 15px;
        }

        .page-title {
            font-family: 'Poppins', sans-serif;
            font-size: 2rem;
            font-weight: 700;
            color: #0066CC;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .btn-add {
            padding: 12px 24px;
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-add:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 102, 204, 0.3);
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            backdrop-filter: blur(4px);
        }

        .modal-content {
            background: white;
            border-radius: 16px;
            padding: 30px;
            max-width: 700px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #E0E6ED;
        }

        .modal-title {
            font-family: 'Poppins', sans-serif;
            font-size: 1.5rem;
            font-weight: 600;
            color: #0066CC;
        }

        .btn-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #5A7C92;
            transition: all 0.3s ease;
        }

        .btn-close:hover {
            color: #DC3545;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        label {
            display: block;
            font-weight: 600;
            color: #2C5282;
            margin-bottom: 8px;
            font-size: 0.95rem;
        }

        input, select, textarea {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #E0E6ED;
            border-radius: 8px;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            font-family: inherit;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #0066CC;
            box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
        }

        textarea {
            min-height: 120px;
            resize: vertical;
        }

        .modal-footer {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 2px solid #E0E6ED;
        }

        .btn-cancel {
            padding: 10px 20px;
            background: #F8F9FA;
            color: #5A7C92;
            border: 2px solid #E0E6ED;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-cancel:hover {
            background: #E9ECEF;
        }

        .btn-save {
            padding: 10px 20px;
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-save:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        }

        .btn-save:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    `;

    static properties = {
        consultas: { type: Array },
        pacientes: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        editingConsulta: { type: Object },
        saving: { type: Boolean },
        isAdmin: { type: Boolean }
    };

    constructor() {
        super();
        this.consultas = [];
        this.pacientes = [];
        this.loading = true;
        this.showModal = false;
        this.editingConsulta = null;
        this.saving = false;
        this.isAdmin = false;
        this.loadData();
    }

    async loadData() {
        try {
            const currentUser = authService.getCurrentUser();
            
            if (this.isAdmin) {
                const [consultasData, pacientesData] = await Promise.all([
                    apiService.getConsultas(),
                    apiService.getPacientes()
                ]);
                this.consultas = consultasData;
                this.pacientes = pacientesData;
            } else if (currentUser.idMedico) {
                const [consultasData, pacientesData] = await Promise.all([
                    apiService.getConsultasByMedico(currentUser.idMedico),
                    apiService.getPacientes()
                ]);
                this.consultas = consultasData;
                this.pacientes = pacientesData;
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.showNotification('Error al cargar datos', 'error');
        } finally {
            this.loading = false;
        }
    }

    openCreateModal() {
        this.editingConsulta = null;
        this.showModal = true;
    }

    openEditModal(e) {
        this.editingConsulta = e.detail.item;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.editingConsulta = null;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const currentUser = authService.getCurrentUser();
        
        const data = {
            idMedico: currentUser.idMedico,
            idPaciente: parseInt(form.paciente.value),
            fechaConsulta: form.fecha.value,
            hi: form.horaInicio.value,
            hf: form.horaFin.value,
            diagnostico: form.diagnostico.value
        };

        this.saving = true;

        try {
            if (this.editingConsulta) {
                await apiService.updateConsulta(this.editingConsulta.IdConsulta, data);
                this.showNotification('Consulta actualizada exitosamente', 'success');
            } else {
                await apiService.createConsulta(data);
                this.showNotification('Consulta creada exitosamente', 'success');
            }

            this.closeModal();
            this.loadData();
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al guardar consulta', 'error');
        } finally {
            this.saving = false;
        }
    }

    async handleDelete(e) {
        const consulta = e.detail.item;
        
        if (confirm(`¿Estás seguro de eliminar esta consulta?`)) {
            try {
                await apiService.deleteConsulta(consulta.IdConsulta);
                this.showNotification('Consulta eliminada exitosamente', 'success');
                this.loadData();
            } catch (error) {
                console.error('Error:', error);
                this.showNotification('Error al eliminar consulta', 'error');
            }
        }
    }

    showNotification(message, type) {
        alert(message);
    }

    renderModal() {
        if (!this.showModal) return '';

        const consulta = this.editingConsulta;

        return html`
            <div class="modal-overlay" @click=${this.closeModal}>
                <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                    <div class="modal-header">
                        <h3 class="modal-title">
                            ${consulta ? 'Editar Consulta' : 'Nueva Consulta'}
                        </h3>
                        <button class="btn-close" @click=${this.closeModal}>
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <form @submit=${this.handleSubmit}>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Paciente *</label>
                                <select name="paciente" required>
                                    <option value="">Selecciona un paciente</option>
                                    ${this.pacientes.map(p => html`
                                        <option 
                                            value="${p.IdPaciente}"
                                            ?selected=${consulta?.IdPaciente === p.IdPaciente}>
                                            ${p.Nombre} - ${p.Cedula}
                                        </option>
                                    `)}
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Fecha *</label>
                                <input 
                                    type="date" 
                                    name="fecha" 
                                    .value=${consulta?.FechaConsulta?.split('T')[0] || ''}
                                    required>
                            </div>

                            <div class="form-group">
                                <label>Hora Inicio *</label>
                                <input 
                                    type="time" 
                                    name="horaInicio" 
                                    .value=${consulta?.HI || ''}
                                    required>
                            </div>

                            <div class="form-group">
                                <label>Hora Fin *</label>
                                <input 
                                    type="time" 
                                    name="horaFin" 
                                    .value=${consulta?.HF || ''}
                                    required>
                            </div>

                            <div class="form-group full-width">
                                <label>Diagnóstico *</label>
                                <textarea 
                                    name="diagnostico" 
                                    placeholder="Ingrese el diagnóstico detallado..."
                                    required>${consulta?.Diagnostico || ''}</textarea>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn-cancel" @click=${this.closeModal}>
                                Cancelar
                            </button>
                            <button type="submit" class="btn-save" ?disabled=${this.saving}>
                                ${this.saving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    render() {
        if (this.loading) {
            return html`<loading-spinner text="Cargando consultas..."></loading-spinner>`;
        }

        const columns = [
            { header: 'ID', field: 'IdConsulta' },
            { header: 'Paciente', field: 'NombrePaciente' },
            { 
                header: 'Fecha', 
                field: 'FechaConsulta',
                render: (fecha) => new Date(fecha).toLocaleDateString('es-ES')
            },
            { header: 'Hora Inicio', field: 'HI' },
            { header: 'Hora Fin', field: 'HF' },
            { 
                header: 'Diagnóstico', 
                field: 'Diagnostico',
                render: (diag) => diag.length > 50 ? diag.substring(0, 50) + '...' : diag
            }
        ];

        return html`
            <div class="page-header">
                <h1 class="page-title">
                    <i class="bi bi-calendar-check"></i>
                    ${this.isAdmin ? 'Todas las Consultas' : 'Mis Consultas'}
                </h1>
                <button class="btn-add" @click=${this.openCreateModal}>
                    <i class="bi bi-plus-circle"></i>
                    Nueva Consulta
                </button>
            </div>

            <data-table
                title="Registro de Consultas Médicas"
                .columns=${columns}
                .data=${this.consultas}
                @edit=${this.openEditModal}
                @delete=${this.handleDelete}>
            </data-table>

            ${this.renderModal()}
        `;
    }
}

customElements.define('consultas-manager', ConsultasManager);