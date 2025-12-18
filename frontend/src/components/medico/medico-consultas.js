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

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
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
        }

        .modal-content {
            background: white;
            border-radius: 16px;
            padding: 30px;
            max-width: 700px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #E0E6ED;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
        }

        input, select, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #E0E6ED;
            border-radius: 8px;
        }

        textarea {
            min-height: 120px;
        }

        .modal-footer {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 25px;
        }

        .btn-cancel, .btn-save {
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
        }

        .btn-cancel {
            background: #F8F9FA;
            border: 2px solid #E0E6ED;
        }

        .btn-save {
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
            border: none;
        }
    `;

    static properties = {
        consultas: { type: Array },
        pacientes: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        editingConsulta: { type: Object },
        saving: { type: Boolean }
    };

    constructor() {
        super();
        this.consultas = [];
        this.pacientes = [];
        this.loading = true;
        this.showModal = false;
        this.editingConsulta = null;
        this.saving = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadData();
    }

    async loadData() {
        try {
            const currentUser = authService.getCurrentUser();
            const [consultasData, pacientesData] = await Promise.all([
                apiService.getConsultasByMedico(currentUser.idMedico),
                apiService.getPacientes()
            ]);
            this.consultas = consultasData;
            this.pacientes = pacientesData;
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar datos');
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
            } else {
                await apiService.createConsulta(data);
            }
            this.closeModal();
            this.loadData();
        } catch (error) {
            alert('Error al guardar');
        } finally {
            this.saving = false;
        }
    }

    async handleDelete(e) {
        if (confirm('¿Eliminar consulta?')) {
            try {
                await apiService.deleteConsulta(e.detail.item.IdConsulta);
                this.loadData();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    renderModal() {
        if (!this.showModal) return '';
        const consulta = this.editingConsulta;

        return html`
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
            <div class="modal-overlay" @click=${this.closeModal}>
                <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                    <div class="modal-header">
                        <h3>${consulta ? 'Editar' : 'Nueva'} Consulta</h3>
                        <button @click=${this.closeModal}>✕</button>
                    </div>
                    <form @submit=${this.handleSubmit}>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Paciente *</label>
                                <select name="paciente" required>
                                    <option value="">Selecciona</option>
                                    ${this.pacientes.map(p => html`
                                        <option value="${p.IdPaciente}" ?selected=${consulta?.IdPaciente === p.IdPaciente}>
                                            ${p.Nombre}
                                        </option>
                                    `)}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Fecha *</label>
                                <input type="date" name="fecha" .value=${consulta?.FechaConsulta?.split('T')[0] || ''} required>
                            </div>
                            <div class="form-group">
                                <label>Hora Inicio *</label>
                                <input type="time" name="horaInicio" .value=${consulta?.HI || ''} required>
                            </div>
                            <div class="form-group">
                                <label>Hora Fin *</label>
                                <input type="time" name="horaFin" .value=${consulta?.HF || ''} required>
                            </div>
                            <div class="form-group full-width">
                                <label>Diagnóstico *</label>
                                <textarea name="diagnostico" required>${consulta?.Diagnostico || ''}</textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-cancel" @click=${this.closeModal}>Cancelar</button>
                            <button type="submit" class="btn-save" ?disabled=${this.saving}>Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    render() {
        if (this.loading) {
            return html`
             <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
            <loading-spinner text="Cargando..."></loading-spinner>`;
        }

        const columns = [
            { header: 'ID', field: 'IdConsulta' },
            { header: 'Paciente', field: 'NombrePaciente' },
            { header: 'Fecha', field: 'FechaConsulta', render: (f) => new Date(f).toLocaleDateString('es-ES') },
            { header: 'Hora Inicio', field: 'HI' },
            { header: 'Hora Fin', field: 'HF' }
        ];

        return html`
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
            <div class="page-header">
                <h1 class="page-title">
                    <i class="bi bi-calendar-check"></i>
                    Mis Consultas
                </h1>
                <button class="btn-add" @click=${this.openCreateModal}>
                    <i class="bi bi-plus-circle"></i>
                    Nueva Consulta
                </button>
            </div>
            <data-table
                title="Registro de Consultas"
                .columns=${columns}
                .data=${this.consultas}
                @edit=${this.openEditModal}
                @delete=${this.handleDelete}>
            </data-table>
            ${this.renderModal()}
        `;
    }
}

customElements.define('medico-consultas', MedicoConsultas);