import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import apiService from '../../services/api.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class MedicosManager extends LitElement {
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

        input, select {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #E0E6ED;
            border-radius: 8px;
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }

        input:focus, select:focus {
            outline: none;
            border-color: #0066CC;
            box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
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
        medicos: { type: Array },
        especialidades: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        editingMedico: { type: Object },
        saving: { type: Boolean }
    };

    constructor() {
        super();
        this.medicos = [];
        this.especialidades = [];
        this.loading = true;
        this.showModal = false;
        this.editingMedico = null;
        this.saving = false;
        this.loadData();
    }

    async loadData() {
        try {
            const [medicosData, especialidadesData] = await Promise.all([
                apiService.getMedicos(),
                apiService.getEspecialidades()
            ]);
            this.medicos = medicosData;
            this.especialidades = especialidadesData;
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.showNotification('Error al cargar datos', 'error');
        } finally {
            this.loading = false;
        }
    }

    openCreateModal() {
        this.editingMedico = null;
        this.showModal = true;
    }

    openEditModal(e) {
        this.editingMedico = e.detail.item;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.editingMedico = null;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const data = {
            nombre: form.nombre.value,
            idEspecialidad: parseInt(form.especialidad.value),
            foto: form.foto.value || 'default.jpg'
        };

        this.saving = true;

        try {
            if (this.editingMedico) {
                await apiService.updateMedico(this.editingMedico.IdMedico, data);
                this.showNotification('Médico actualizado exitosamente', 'success');
            } else {
                await apiService.createMedico(data);
                this.showNotification('Médico creado exitosamente', 'success');
            }

            this.closeModal();
            this.loadData();
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al guardar médico', 'error');
        } finally {
            this.saving = false;
        }
    }

    async handleDelete(e) {
        const medico = e.detail.item;
        
        if (confirm(`¿Estás seguro de eliminar al médico "${medico.Nombre}"?`)) {
            try {
                await apiService.deleteMedico(medico.IdMedico);
                this.showNotification('Médico eliminado exitosamente', 'success');
                this.loadData();
            } catch (error) {
                console.error('Error:', error);
                this.showNotification('Error al eliminar médico', 'error');
            }
        }
    }

    showNotification(message, type) {
        alert(message);
    }

    renderModal() {
        if (!this.showModal) return '';

        const medico = this.editingMedico;

        return html`
            <div class="modal-overlay" @click=${this.closeModal}>
                <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                    <div class="modal-header">
                        <h3 class="modal-title">
                            ${medico ? 'Editar Médico' : 'Nuevo Médico'}
                        </h3>
                        <button class="btn-close" @click=${this.closeModal}>
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <form @submit=${this.handleSubmit}>
                        <div class="form-group">
                            <label>Nombre Completo *</label>
                            <input 
                                type="text" 
                                name="nombre" 
                                .value=${medico?.Nombre || ''}
                                placeholder="Dr. Juan Pérez"
                                required>
                        </div>

                        <div class="form-group">
                            <label>Especialidad *</label>
                            <select 
                                name="especialidad" 
                                required>
                                <option value="">Selecciona una especialidad</option>
                                ${this.especialidades.map(esp => html`
                                    <option 
                                        value="${esp.IdEspecialidad}"
                                        ?selected=${medico?.IdEspecialidad === esp.IdEspecialidad}>
                                        ${esp.Descripcion}
                                    </option>
                                `)}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Foto (URL o nombre de archivo)</label>
                            <input 
                                type="text" 
                                name="foto" 
                                .value=${medico?.Foto || ''}
                                placeholder="default.jpg">
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
            return html`<loading-spinner text="Cargando médicos..."></loading-spinner>`;
        }

        const columns = [
            { header: 'ID', field: 'IdMedico' },
            { header: 'Nombre', field: 'Nombre' },
            { header: 'Especialidad', field: 'Especialidad' },
            { header: 'Foto', field: 'Foto' }
        ];

        return html`
            <div class="page-header">
                <h1 class="page-title">
                    <i class="bi bi-person-badge"></i>
                    Médicos
                </h1>
                <button class="btn-add" @click=${this.openCreateModal}>
                    <i class="bi bi-plus-circle"></i>
                    Nuevo Médico
                </button>
            </div>

            <data-table
                title="Listado de Médicos"
                .columns=${columns}
                .data=${this.medicos}
                @edit=${this.openEditModal}
                @delete=${this.handleDelete}>
            </data-table>

            ${this.renderModal()}
        `;
    }
}

customElements.define('medicos-manager', MedicosManager);