import { LitElement, html, css } from 'lit';
import apiService from '../../services/api.service.js';
import authService from '../../services/auth.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class MedicoConsultas extends LitElement {
    static styles = css`
        :host {
            display: block;
            font-family: 'Poppins', sans-serif;
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .page-title {
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

        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.6);
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
            position: relative;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #E0E6ED;
        }

        .modal-header h3 { margin: 0; color: #0066CC; }

        .btn-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .form-group.full-width { grid-column: 1 / -1; }

        label { display: block; font-weight: 600; margin-bottom: 8px; color: #444; }

        input, select, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #E0E6ED;
            border-radius: 8px;
            box-sizing: border-box;
        }

        input:disabled, select:disabled, textarea:disabled {
            background-color: #f8f9fa;
            color: #666;
            border-color: #eee;
        }

        .modal-footer {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 25px;
        }

        .btn-cancel, .btn-save, .btn-confirm-delete {
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: 0.2s;
        }

        .btn-cancel { background: #F8F9FA; border: 2px solid #E0E6ED; }
        .btn-save { background: #0066CC; color: white; border: none; }
        .btn-confirm-delete { background: #dc3545; color: white; border: none; }

        /* Toast / Notification system */
        .toast-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 3000;
        }

        .toast {
            background: #28a745;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            margin-top: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease-out;
        }

        .toast.error { background: #dc3545; }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;

    static properties = {
        consultas: { type: Array },
        pacientes: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        showConfirmDelete: { type: Boolean },
        editingConsulta: { type: Object },
        saving: { type: Boolean },
        isReadOnly: { type: Boolean },
        notification: { type: Object }
    };

    constructor() {
        super();
        this.consultas = [];
        this.pacientes = [];
        this.loading = true;
        this.showModal = false;
        this.showConfirmDelete = false;
        this.editingConsulta = null;
        this.saving = false;
        this.isReadOnly = false;
        this.notification = null;
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
            this.notify('Error al cargar datos', 'error');
        } finally {
            this.loading = false;
        }
    }

    notify(message, type = 'success') {
        this.notification = { message, type };
        setTimeout(() => { this.notification = null; }, 3000);
    }

    openCreateModal() {
        this.editingConsulta = null;
        this.isReadOnly = false;
        this.showModal = true;
    }

    openEditModal(e) {
        this.editingConsulta = e.detail.item;
        this.isReadOnly = false;
        this.showModal = true;
    }

    openViewModal(e) {
        this.editingConsulta = e.detail.item;
        this.isReadOnly = true;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.editingConsulta = null;
        this.isReadOnly = false;
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
                this.notify('Consulta actualizada con éxito');
            } else {
                await apiService.createConsulta(data);
                this.notify('Consulta guardada con éxito');
            }
            this.closeModal();
            this.loadData();
        } catch (error) {
            this.notify('Error al procesar la operación', 'error');
        } finally {
            this.saving = false;
        }
    }

    handleDeleteRequest(e) {
        this.itemToDelete = e.detail.item;
        this.showConfirmDelete = true;
    }

    async confirmDelete() {
        try {
            await apiService.deleteConsulta(this.itemToDelete.IdConsulta);
            this.notify('Consulta eliminada');
            this.showConfirmDelete = false;
            this.loadData();
        } catch (error) {
            this.notify('Error al eliminar', 'error');
        }
    }

    renderConfirmDeleteModal() {
        if (!this.showConfirmDelete) return '';
        return html`
            <div class="modal-overlay">
                <div class="modal-content" style="max-width: 400px; text-align: center;">
                    <i class="bi bi-exclamation-triangle-fill" style="font-size: 3rem; color: #dc3545;"></i>
                    <h3>¿Estás seguro?</h3>
                    <p>Esta acción eliminará permanentemente el registro de la consulta.</p>
                    <div class="modal-footer" style="justify-content: center;">
                        <button class="btn-cancel" @click=${() => this.showConfirmDelete = false}>Cancelar</button>
                        <button class="btn-confirm-delete" @click=${this.confirmDelete}>Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderModal() {
        if (!this.showModal) return '';
        const consulta = this.editingConsulta;

        return html`
            <div class="modal-overlay" @click=${this.closeModal}>
                <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                    <div class="modal-header">
                        <h3>${this.isReadOnly ? 'Detalles de' : (consulta ? 'Editar' : 'Nueva')} Consulta</h3>
                        <button class="btn-close" @click=${this.closeModal}>✕</button>
                    </div>
                    <form @submit=${this.handleSubmit}>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Paciente *</label>
                                <select name="paciente" required ?disabled=${this.isReadOnly}>
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
                                <input type="date" name="fecha" .value=${consulta?.FechaConsulta?.split('T')[0] || ''} required ?disabled=${this.isReadOnly}>
                            </div>
                            <div class="form-group">
                                <label>Hora Inicio *</label>
                                <input type="time" name="horaInicio" .value=${consulta?.HI || ''} required ?disabled=${this.isReadOnly}>
                            </div>
                            <div class="form-group">
                                <label>Hora Fin *</label>
                                <input type="time" name="horaFin" .value=${consulta?.HF || ''} required ?disabled=${this.isReadOnly}>
                            </div>
                            <div class="form-group full-width">
                                <label>Diagnóstico *</label>
                                <textarea name="diagnostico" required ?disabled=${this.isReadOnly}>${consulta?.Diagnostico || ''}</textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-cancel" @click=${this.closeModal}>
                                ${this.isReadOnly ? 'Cerrar' : 'Cancelar'}
                            </button>
                            ${!this.isReadOnly ? html`
                                <button type="submit" class="btn-save" ?disabled=${this.saving}>
                                    ${this.saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            ` : ''}
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
            { header: 'Fecha', field: 'FechaConsulta', render: (f) => new Date(f).toLocaleDateString('es-ES') },
            { header: 'Horario', field: 'HI', render: (val, item) => `${item.HI} - ${item.HF}` }
        ];

        return html`
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
            
            <div class="page-header">
                <h1 class="page-title">
                    <i class="bi bi-calendar-check"></i> Mis Consultas
                </h1>
                <button class="btn-add" @click=${this.openCreateModal}>
                    <i class="bi bi-plus-circle"></i> Nueva Consulta
                </button>
            </div>

            <data-table
                title="Registro de Consultas"
                .columns=${columns}
                .data=${this.consultas}
                @view=${this.openViewModal}
                @edit=${this.openEditModal}
                @delete=${this.handleDeleteRequest}>
            </data-table>

            ${this.renderModal()}
            ${this.renderConfirmDeleteModal()}

            <div class="toast-container">
                ${this.notification ? html`
                    <div class="toast ${this.notification.type}">
                        <i class="bi ${this.notification.type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i>
                        ${this.notification.message}
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('medico-consultas', MedicoConsultas);