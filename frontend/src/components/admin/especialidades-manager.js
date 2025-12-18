import { LitElement, html, css } from 'lit';
import apiService from '../../services/api.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class EspecialidadesManager extends LitElement {
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
            max-width: 600px;
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

        .form-group {
            margin-bottom: 20px;
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
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #0066CC;
            box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
        }

        .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
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
        especialidades: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        editingEspecialidad: { type: Object },
        saving: { type: Boolean }
    };

    constructor() {
        super();
        this.especialidades = [];
        this.loading = true;
        this.showModal = false;
        this.editingEspecialidad = null;
        this.saving = false;
        this.loadEspecialidades();
    }

    async loadEspecialidades() {
        try {
            this.especialidades = await apiService.getEspecialidades();
        } catch (error) {
            console.error('Error al cargar especialidades:', error);
            this.showNotification('Error al cargar especialidades', 'error');
        } finally {
            this.loading = false;
        }
    }

    openCreateModal() {
        this.editingEspecialidad = null;
        this.showModal = true;
    }

    openEditModal(e) {
        this.editingEspecialidad = e.detail.item;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.editingEspecialidad = null;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const data = {
            descripcion: form.descripcion.value,
            dias: form.dias.value,
            franja_hi: form.franja_hi.value,
            franja_hf: form.franja_hf.value
        };

        this.saving = true;

        try {
            if (this.editingEspecialidad) {
                await apiService.updateEspecialidad(this.editingEspecialidad.IdEspecialidad, data);
                this.showNotification('Especialidad actualizada exitosamente', 'success');
            } else {
                await apiService.createEspecialidad(data);
                this.showNotification('Especialidad creada exitosamente', 'success');
            }

            this.closeModal();
            this.loadEspecialidades();
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al guardar especialidad', 'error');
        } finally {
            this.saving = false;
        }
    }

    async handleDelete(e) {
        const especialidad = e.detail.item;
        
        if (confirm(`¿Estás seguro de eliminar la especialidad "${especialidad.Descripcion}"?`)) {
            try {
                await apiService.deleteEspecialidad(especialidad.IdEspecialidad);
                this.showNotification('Especialidad eliminada exitosamente', 'success');
                this.loadEspecialidades();
            } catch (error) {
                console.error('Error:', error);
                this.showNotification('Error al eliminar especialidad', 'error');
            }
        }
    }

    showNotification(message, type) {
        // Implementar sistema de notificaciones
        alert(message);
    }

    renderModal() {
        if (!this.showModal) return '';

        const esp = this.editingEspecialidad;

        return html`
            <div class="modal-overlay" @click=${this.closeModal}>
                <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                    <div class="modal-header">
                        <h3 class="modal-title">
                            ${esp ? 'Editar Especialidad' : 'Nueva Especialidad'}
                        </h3>
                        <button class="btn-close" @click=${this.closeModal}>
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <form @submit=${this.handleSubmit}>
                        <div class="form-group">
                            <label>Descripción *</label>
                            <input 
                                type="text" 
                                name="descripcion" 
                                .value=${esp?.Descripcion || ''}
                                placeholder="Ej: Cardiología"
                                required>
                        </div>

                        <div class="form-group">
                            <label>Días de Atención *</label>
                            <input 
                                type="text" 
                                name="dias" 
                                .value=${esp?.Dias || ''}
                                placeholder="Ej: Lunes, Miércoles, Viernes"
                                required>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Hora Inicio *</label>
                                <input 
                                    type="time" 
                                    name="franja_hi" 
                                    .value=${esp?.Franja_HI || ''}
                                    required>
                            </div>

                            <div class="form-group">
                                <label>Hora Fin *</label>
                                <input 
                                    type="time" 
                                    name="franja_hf" 
                                    .value=${esp?.Franja_HF || ''}
                                    required>
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
            return html`<loading-spinner text="Cargando especialidades..."></loading-spinner>`;
        }

        const columns = [
            { header: 'ID', field: 'IdEspecialidad' },
            { header: 'Especialidad', field: 'Descripcion' },
            { header: 'Días', field: 'Dias' },
            { header: 'Hora Inicio', field: 'Franja_HI' },
            { header: 'Hora Fin', field: 'Franja_HF' }
        ];

        return html`
            <div class="page-header">
                <h1 class="page-title">
                    <i class="bi bi-hospital"></i>
                    Especialidades Médicas
                </h1>
                <button class="btn-add" @click=${this.openCreateModal}>
                    <i class="bi bi-plus-circle"></i>
                    Nueva Especialidad
                </button>
            </div>

            <data-table
                title="Listado de Especialidades"
                .columns=${columns}
                .data=${this.especialidades}
                @edit=${this.openEditModal}
                @delete=${this.handleDelete}>
            </data-table>

            ${this.renderModal()}
        `;
    }
}

customElements.define('especialidades-manager', EspecialidadesManager);