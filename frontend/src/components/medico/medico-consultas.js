import { LitElement, html, css } from 'lit';
import apiService from '../../services/api.service.js';
import authService from '../../services/auth.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class MedicoConsultas extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        * {
            box-sizing: border-box;
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            gap: 15px;
            flex-wrap: wrap;
        }

        .page-title {
            font-family: 'Poppins', sans-serif;
            font-size: 2rem;
            font-weight: 700;
            color: #0066CC;
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0;
        }

        .btn-add {
            padding: 12px 24px;
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }


        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            padding: 20px;
        }

        .modal-content {
            background: white;
            border-radius: 16px;
            padding: 30px;
            max-width: 700px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
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
            font-size: 1.4rem;
            font-weight: 600;
            color: #0066CC;
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0;
        }

        .btn-close {
            background: none;
            border: none;
            font-size: 1.4rem;
            cursor: pointer;
        }


        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            width: 100%;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        .full-width {
            grid-column: 1 / -1;
        }

        label {
            font-weight: 600;
            margin-bottom: 8px;
            color: #2C5282;
        }

        input, select, textarea {
            width: 100%;
            max-width: 100%;
            padding: 12px;
            border: 2px solid #E0E6ED;
            border-radius: 8px;
            font-family: inherit;
        }

        textarea {
            resize: vertical;
            min-height: 120px;
        }

        input:disabled, textarea:disabled, select:disabled {
            background: #F8F9FA;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 25px;
            flex-wrap: wrap;
        }

        .btn-cancel {
            background: #F8F9FA;
            border: 2px solid #E0E6ED;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
        }

        .btn-save {
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
        }


        .detail {
            background: #F8F9FA;
            padding: 12px;
            border-radius: 8px;
            font-size: 0.95rem;
        }
    `;

    static properties = {
        consultas: { type: Array },
        pacientes: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        modalMode: { type: String }, 
        editingConsulta: { type: Object },
        saving: { type: Boolean }
    };

    constructor() {
        super();
        this.consultas = [];
        this.pacientes = [];
        this.loading = true;
        this.showModal = false;
        this.modalMode = 'view';
        this.editingConsulta = null;
        this.saving = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadData();
    }

    async loadData() {
        const user = authService.getCurrentUser();
        const [consultas, pacientes] = await Promise.all([
            apiService.getConsultasByMedico(user.idMedico),
            apiService.getPacientes()
        ]);
        this.consultas = consultas;
        this.pacientes = pacientes;
        this.loading = false;
    }

    openViewModal(e) {
        this.editingConsulta = e.detail.item;
        this.modalMode = 'view';
        this.showModal = true;
    }

    openEditModal(e) {
        this.editingConsulta = e.detail.item;
        this.modalMode = 'edit';
        this.showModal = true;
    }

    openCreateModal() {
        this.editingConsulta = null;
        this.modalMode = 'create';
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.editingConsulta = null;
    }

    async handleSubmit(e) {
        e.preventDefault();
        const f = e.target;
        const user = authService.getCurrentUser();

        const data = {
            idMedico: user.idMedico,
            idPaciente: +f.paciente.value,
            fechaConsulta: f.fecha.value,
            hi: f.hi.value,
            hf: f.hf.value,
            diagnostico: f.diagnostico.value
        };

        this.saving = true;
        if (this.modalMode === 'edit') {
            await apiService.updateConsulta(this.editingConsulta.IdConsulta, data);
        } else {
            await apiService.createConsulta(data);
        }
        this.saving = false;
        this.closeModal();
        this.loadData();
    }

    renderModal() {
        if (!this.showModal) return '';

        const c = this.editingConsulta;
        const view = this.modalMode === 'view';

        return html`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">

        <div class="modal-overlay" @click=${this.closeModal}>
            <div class="modal-content" @click=${e => e.stopPropagation()}>
                <div class="modal-header">
                    <h3 class="modal-title">
                        <i class="bi bi-${view ? 'eye' : 'pencil'}"></i>
                        ${view ? 'Detalle Consulta' : 'Consulta'}
                    </h3>
                    <button class="btn-close" @click=${this.closeModal}>✕</button>
                </div>

                ${view ? html`
                    <div class="form-grid">
                        <div class="detail"><strong>Paciente:</strong> ${c.NombrePaciente}</div>
                        <div class="detail"><strong>Fecha:</strong> ${new Date(c.FechaConsulta).toLocaleDateString()}</div>
                        <div class="detail"><strong>Hora Inicio:</strong> ${c.HI}</div>
                        <div class="detail"><strong>Hora Fin:</strong> ${c.HF}</div>
                        <div class="detail full-width"><strong>Diagnóstico:</strong> ${c.Diagnostico}</div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-save" @click=${this.closeModal}>Cerrar</button>
                    </div>
                ` : html`
                    <form @submit=${this.handleSubmit}>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Paciente *</label>
                                <select name="paciente" required>
                                    ${this.pacientes.map(p => html`
                                        <option value="${p.IdPaciente}" ?selected=${c?.IdPaciente === p.IdPaciente}>
                                            ${p.Nombre}
                                        </option>
                                    `)}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Fecha *</label>
                                <input type="date" name="fecha" .value=${c?.FechaConsulta?.split('T')[0] || ''} required>
                            </div>
                            <div class="form-group">
                                <label>Hora Inicio *</label>
                                <input type="time" name="hi" .value=${c?.HI || ''} required>
                            </div>
                            <div class="form-group">
                                <label>Hora Fin *</label>
                                <input type="time" name="hf" .value=${c?.HF || ''} required>
                            </div>
                            <div class="form-group full-width">
                                <label>Diagnóstico *</label>
                                <textarea name="diagnostico" required>${c?.Diagnostico || ''}</textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-cancel" @click=${this.closeModal}>Cancelar</button>
                            <button class="btn-save" ?disabled=${this.saving}>
                                ${this.saving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                `}
            </div>
        </div>`;
    }

    render() {
        if (this.loading) {
            return html`<loading-spinner text="Cargando consultas..."></loading-spinner>`;
        }

        const columns = [
            { header: 'ID', field: 'IdConsulta' },
            { header: 'Paciente', field: 'NombrePaciente' },
            { header: 'Fecha', field: 'FechaConsulta', render: f => new Date(f).toLocaleDateString() },
            { header: 'Hora Inicio', field: 'HI' },
            { header: 'Hora Fin', field: 'HF' }
        ];

        return html`
        <div class="page-header">
            <h1 class="page-title"><i class="bi bi-calendar-check"></i> Mis Consultas</h1>
            <button class="btn-add" @click=${this.openCreateModal}>
                <i class="bi bi-plus-circle"></i> Nueva Consulta
            </button>
        </div>

        <data-table
            .columns=${columns}
            .data=${this.consultas}
            @view=${this.openViewModal}
            @edit=${this.openEditModal}
            @delete=${e => apiService.deleteConsulta(e.detail.item.IdConsulta).then(() => this.loadData())}>
        </data-table>

        ${this.renderModal()}
        `;
    }
}

customElements.define('medico-consultas', MedicoConsultas);
