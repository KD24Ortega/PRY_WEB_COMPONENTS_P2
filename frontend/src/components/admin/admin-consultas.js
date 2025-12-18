import { LitElement, html, css } from 'lit';
import apiService from '../../services/api.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class AdminConsultas extends LitElement {
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
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .btn-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #5A7C92;
            transition: all 0.3s ease;
            padding: 0;
            min-width: auto;
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
            margin-bottom: 0;
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

        input[disabled], select[disabled], textarea[disabled] {
            background: #F8F9FA;
            color: #5A7C92;
            cursor: not-allowed;
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
            flex-wrap: wrap;
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

        .btn-primary {
            padding: 10px 20px;
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        }

        .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .btn-danger {
            background: linear-gradient(135deg, #DC3545 0%, #C82333 100%);
        }

        .btn-danger:hover {
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }

        .msg-box {
            padding: 15px;
            border-radius: 8px;
            border: 1px solid;
            display: flex;
            gap: 12px;
            align-items: flex-start;
            line-height: 1.5;
            margin-bottom: 20px;
        }

        .msg-icon {
            font-size: 1.5rem;
            line-height: 1;
        }

        .msg-content {
            flex: 1;
        }

        .msg-title {
            font-weight: 600;
            margin: 0 0 5px 0;
            font-size: 1rem;
        }

        .msg-text {
            margin: 0;
            font-size: 0.95rem;
        }

        .msg-error {
            border-color: #dc3545;
            background: rgba(220, 53, 69, 0.1);
            color: #721c24;
        }

        .detail-grid {
            display: grid;
            gap: 20px;
        }

        .detail-item {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .detail-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: #5A7C92;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .detail-value {
            font-size: 1rem;
            color: #2C5282;
            padding: 10px;
            background: #F8F9FA;
            border-radius: 6px;
            min-height: 42px;
            display: flex;
            align-items: center;
        }

        .detail-value.full {
            white-space: pre-wrap;
            align-items: flex-start;
        }

        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 3000;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .notification.success {
            background: #28a745;
            color: white;
        }

        .notification.error {
            background: #dc3545;
            color: white;
        }

        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @media (max-width: 768px) {
            .modal-content {
                padding: 20px;
            }

            .form-grid {
                grid-template-columns: 1fr;
            }

            .page-title {
                font-size: 1.5rem;
            }
        }
    `;

    static properties = {
        consultas: { type: Array },
        pacientes: { type: Array },
        medicos: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        modalMode: { type: String },
        editingConsulta: { type: Object },
        saving: { type: Boolean },
        showConfirmModal: { type: Boolean },
        confirmTitle: { type: String },
        confirmText: { type: String },
        pendingDeleteItem: { type: Object },
        deleting: { type: Boolean },
        notification: { type: Object }
    };

    constructor() {
        super();
        this.consultas = [];
        this.pacientes = [];
        this.medicos = [];
        this.loading = true;
        this.showModal = false;
        this.modalMode = 'view';
        this.editingConsulta = null;
        this.saving = false;
        this.showConfirmModal = false;
        this.confirmTitle = '';
        this.confirmText = '';
        this.pendingDeleteItem = null;
        this.deleting = false;
        this.notification = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadData();
    }

    async loadData() {
        try {
            const [consultasData, pacientesData, medicosData] = await Promise.all([
                apiService.getConsultas(),
                apiService.getPacientes(),
                apiService.getMedicos()
            ]);
            this.consultas = consultasData;
            this.pacientes = pacientesData;
            this.medicos = medicosData;
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al cargar datos', 'error');
        } finally {
            this.loading = false;
        }
    }

    openViewModal(e) {
        this.editingConsulta = e.detail.item;
        this.modalMode = 'view';
        this.showModal = true;
    }

    openCreateModal() {
        this.editingConsulta = null;
        this.modalMode = 'create';
        this.showModal = true;
    }

    openEditModal(e) {
        this.editingConsulta = e.detail.item;
        this.modalMode = 'edit';
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.editingConsulta = null;
        this.modalMode = 'view';
    }

    openConfirmDelete(item, title, text) {
        this.pendingDeleteItem = item;
        this.confirmTitle = title;
        this.confirmText = text;
        this.showConfirmModal = true;
        this.deleting = false;
    }

    closeConfirm() {
        this.showConfirmModal = false;
        this.pendingDeleteItem = null;
        this.confirmTitle = '';
        this.confirmText = '';
        this.deleting = false;
    }

    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const data = {
            idMedico: parseInt(form.medico.value),
            idPaciente: parseInt(form.paciente.value),
            fechaConsulta: form.fecha.value,
            hi: form.horaInicio.value,
            hf: form.horaFin.value,
            diagnostico: form.diagnostico.value
        };

        this.saving = true;
        try {
            if (this.modalMode === 'edit') {
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

    handleDelete(e) {
        const consulta = e.detail.item;
        this.openConfirmDelete(
            consulta,
            'Confirmar eliminación',
            `¿Estás seguro de eliminar la consulta del paciente "${consulta.NombrePaciente}"?`
        );
    }

    async confirmDelete() {
        const consulta = this.pendingDeleteItem;
        if (!consulta) return;

        this.deleting = true;

        try {
            await apiService.deleteConsulta(consulta.IdConsulta);
            this.showNotification('Consulta eliminada exitosamente', 'success');
            this.closeConfirm();
            this.loadData();
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al eliminar consulta', 'error');
            this.closeConfirm();
        } finally {
            this.deleting = false;
        }
    }

    showNotification(message, type) {
        this.notification = { message, type };
        setTimeout(() => {
            this.notification = null;
        }, 3000);
    }

    renderNotification() {
        if (!this.notification) return '';

        return html`
            <div class="notification ${this.notification.type}">
                <i class="bi bi-${this.notification.type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                ${this.notification.message}
            </div>
        `;
    }

    renderConfirmModal() {
        if (!this.showConfirmModal) return '';

        return html`
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
            <div class="modal-overlay" @click=${this.closeConfirm}>
                <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                    <div class="modal-header">
                        <h3 class="modal-title">
                            <i class="bi bi-exclamation-triangle"></i>
                            ${this.confirmTitle || 'Confirmación'}
                        </h3>
                        <button class="btn-close" @click=${this.closeConfirm}>
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <div class="msg-box msg-error">
                        <i class="bi bi-exclamation-triangle-fill msg-icon"></i>
                        <div class="msg-content">
                            <p class="msg-title">Atención</p>
                            <p class="msg-text">${this.confirmText}</p>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn-cancel" @click=${this.closeConfirm}>Cancelar</button>
                        <button class="btn-primary btn-danger" ?disabled=${this.deleting} @click=${this.confirmDelete}>
                            ${this.deleting ? 'Eliminando...' : 'Eliminar'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderModal() {
        if (!this.showModal) return '';

        const consulta = this.editingConsulta;
        const isView = this.modalMode === 'view';
        const isEdit = this.modalMode === 'edit';

        return html`
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
            <div class="modal-overlay" @click=${this.closeModal}>
                <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                    <div class="modal-header">
                        <h3 class="modal-title">
                            <i class="bi bi-${isView ? 'eye' : isEdit ? 'pencil' : 'plus-circle'}"></i>
                            ${isView ? 'Ver Consulta' : isEdit ? 'Editar Consulta' : 'Nueva Consulta'}
                        </h3>
                        <button class="btn-close" @click=${this.closeModal}>
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>

                    ${isView ? html`
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="detail-label">ID Consulta</span>
                                <span class="detail-value">${consulta.IdConsulta}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Médico</span>
                                <span class="detail-value">${consulta.NombreMedico}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Paciente</span>
                                <span class="detail-value">${consulta.NombrePaciente}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Fecha</span>
                                <span class="detail-value">${new Date(consulta.FechaConsulta).toLocaleDateString('es-ES')}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Hora Inicio</span>
                                <span class="detail-value">${consulta.HI}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Hora Fin</span>
                                <span class="detail-value">${consulta.HF}</span>
                            </div>
                            <div class="detail-item full-width">
                                <span class="detail-label">Diagnóstico</span>
                                <span class="detail-value full">${consulta.Diagnostico}</span>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button class="btn-primary" @click=${this.closeModal}>Cerrar</button>
                        </div>
                    ` : html`
                        <form @submit=${this.handleSubmit}>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Médico *</label>
                                    <select name="medico" required>
                                        <option value="">Selecciona un médico</option>
                                        ${this.medicos.map(m => html`
                                            <option value="${m.IdMedico}" ?selected=${consulta?.IdMedico === m.IdMedico}>
                                                ${m.Nombre}
                                            </option>
                                        `)}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Paciente *</label>
                                    <select name="paciente" required>
                                        <option value="">Selecciona un paciente</option>
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
                                    <textarea name="diagnostico" placeholder="Descripción del diagnóstico" required>${consulta?.Diagnostico || ''}</textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn-cancel" @click=${this.closeModal}>Cancelar</button>
                                <button type="submit" class="btn-primary" ?disabled=${this.saving}>
                                    ${this.saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    `}
                </div>
            </div>
        `;
    }

    render() {
        if (this.loading) {
            return html`
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
                <loading-spinner text="Cargando consultas..."></loading-spinner>
            `;
        }

        const columns = [
            { header: 'ID', field: 'IdConsulta' },
            { header: 'Médico', field: 'NombreMedico' },
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
                    Todas las Consultas
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
                @view=${this.openViewModal}
                @edit=${this.openEditModal}
                @delete=${this.handleDelete}>
            </data-table>
            ${this.renderModal()}
            ${this.renderConfirmModal()}
            ${this.renderNotification()}
        `;
    }
}

customElements.define('admin-consultas', AdminConsultas);