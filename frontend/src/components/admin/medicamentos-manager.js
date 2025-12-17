import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import apiService from '../../services/api.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class MedicamentosManager extends LitElement {
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
        medicamentos: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        editingMedicamento: { type: Object },
        saving: { type: Boolean }
    };

    constructor() {
        super();
        this.medicamentos = [];
        this.loading = true;
        this.showModal = false;
        this.editingMedicamento = null;
        this.saving = false;
        this.loadMedicamentos();
    }

    async loadMedicamentos() {
        try {
            this.medicamentos = await apiService.getMedicamentos();
        } catch (error) {
            console.error('Error al cargar medicamentos:', error);
            this.showNotification('Error al cargar medicamentos', 'error');
        } finally {
            this.loading = false;
        }
    }

    openCreateModal() {
        this.editingMedicamento = null;
        this.showModal = true;
    }

    openEditModal(e) {
        this.editingMedicamento = e.detail.item;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.editingMedicamento = null;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const data = {
            nombre: form.nombre.value,
            tipo: form.tipo.value
        };

        this.saving = true;

        try {
            if (this.editingMedicamento) {
                await apiService.updateMedicamento(this.editingMedicamento.IdMedicamento, data);
                this.showNotification('Medicamento actualizado exitosamente', 'success');
            } else {
                await apiService.createMedicamento(data);
                this.showNotification('Medicamento creado exitosamente', 'success');
            }

            this.closeModal();
            this.loadMedicamentos();
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al guardar medicamento', 'error');
        } finally {
            this.saving = false;
        }
    }

    async handleDelete(e) {
        const medicamento = e.detail.item;
        
        if (confirm(`¿Estás seguro de eliminar el medicamento "${medicamento.Nombre}"?`)) {
            try {
                await apiService.deleteMedicamento(medicamento.IdMedicamento);
                this.showNotification('Medicamento eliminado exitosamente', 'success');
                this.loadMedicamentos();
            } catch (error) {
                console.error('Error:', error);
                this.showNotification('Error al eliminar medicamento', 'error');
            }
        }
    }

    showNotification(message, type) {
        alert(message);
    }

    renderModal() {
        if (!this.showModal) return '';

        const medicamento = this.editingMedicamento;

        return html`
            <div class="modal-overlay" @click=${this.closeModal}>
                <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                    <div class="modal-header">
                        <h3 class="modal-title">
                            ${medicamento ? 'Editar Medicamento' : 'Nuevo Medicamento'}
                        </h3>
                        <button class="btn-close" @click=${this.closeModal}>
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <form @submit=${this.handleSubmit}>
                        <div class="form-group">
                            <label>Nombre del Medicamento *</label>
                            <input 
                                type="text" 
                                name="nombre" 
                                .value=${medicamento?.Nombre || ''}
                                placeholder="Ej: Paracetamol"
                                required>
                        </div>

                        <div class="form-group">
                            <label>Tipo *</label>
                            <select name="tipo" required>
                                <option value="">Selecciona un tipo</option>
                                <option value="Tableta" ?selected=${medicamento?.Tipo === 'Tableta'}>Tableta</option>
                                <option value="Cápsula" ?selected=${medicamento?.Tipo === 'Cápsula'}>Cápsula</option>
                                <option value="Jarabe" ?selected=${medicamento?.Tipo === 'Jarabe'}>Jarabe</option>
                                <option value="Inyectable" ?selected=${medicamento?.Tipo === 'Inyectable'}>Inyectable</option>
                                <option value="Crema" ?selected=${medicamento?.Tipo === 'Crema'}>Crema</option>
                                <option value="Gotas" ?selected=${medicamento?.Tipo === 'Gotas'}>Gotas</option>
                                <option value="Inhalador" ?selected=${medicamento?.Tipo === 'Inhalador'}>Inhalador</option>
                                <option value="Supositorio" ?selected=${medicamento?.Tipo === 'Supositorio'}>Supositorio</option>
                            </select>
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
            return html`<loading-spinner text="Cargando medicamentos..."></loading-spinner>`;
        }

        const columns = [
            { header: 'ID', field: 'IdMedicamento' },
            { header: 'Nombre', field: 'Nombre' },
            { header: 'Tipo', field: 'Tipo' }
        ];

        return html`
            <div class="page-header">
                <h1 class="page-title">
                    <i class="bi bi-capsule"></i>
                    Medicamentos
                </h1>
                <button class="btn-add" @click=${this.openCreateModal}>
                    <i class="bi bi-plus-circle"></i>
                    Nuevo Medicamento
                </button>
            </div>

            <data-table
                title="Catálogo de Medicamentos"
                .columns=${columns}
                .data=${this.medicamentos}
                @edit=${this.openEditModal}
                @delete=${this.handleDelete}>
            </data-table>

            ${this.renderModal()}
        `;
    }
}

customElements.define('medicamentos-manager', MedicamentosManager);