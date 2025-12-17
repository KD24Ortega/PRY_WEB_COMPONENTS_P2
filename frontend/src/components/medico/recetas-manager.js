import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import apiService from '../../services/api.service.js';
import authService from '../../services/auth.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class RecetasManager extends LitElement {
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
        recetas: { type: Array },
        consultas: { type: Array },
        medicamentos: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        editingReceta: { type: Object },
        saving: { type: Boolean },
        isAdmin: { type: Boolean }
    };

    constructor() {
        super();
        this.recetas = [];
        this.consultas = [];
        this.medicamentos = [];
        this.loading = true;
        this.showModal = false;
        this.editingReceta = null;
        this.saving = false;
        this.isAdmin = false;
        this.loadData();
    }

    async loadData() {
        try {
            const currentUser = authService.getCurrentUser();
            
            if (this.isAdmin) {
                const [recetasData, medicamentosData] = await Promise.all([
                    apiService.getRecetas(),
                    apiService.getMedicamentos()
                ]);
                this.recetas = recetasData;
                this.medicamentos = medicamentosData;
            } else if (currentUser.idMedico) {
                const [consultasData, medicamentosData] = await Promise.all([
                    apiService.getConsultasByMedico(currentUser.idMedico),
                    apiService.getMedicamentos()
                ]);
                this.consultas = consultasData;
                this.medicamentos = medicamentosData;
                
                // Cargar recetas de las consultas del médico
                const recetasPromises = consultasData.map(c => 
                    apiService.getRecetasByConsulta(c.IdConsulta)
                );
                const recetasArrays = await Promise.all(recetasPromises);
                this.recetas = recetasArrays.flat();
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.showNotification('Error al cargar datos', 'error');
        } finally {
            this.loading = false;
        }
    }

    openCreateModal() {
        this.editingReceta = null;
        this.showModal = true;
    }

    openEditModal(e) {
        this.editingReceta = e.detail.item;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.editingReceta = null;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const data = {
            idConsulta: parseInt(form.consulta.value),
            idMedicamento: parseInt(form.medicamento.value),
            cantidad: parseInt(form.cantidad.value)
        };

        this.saving = true;

        try {
            if (this.editingReceta) {
                await apiService.updateReceta(this.editingReceta.IdReceta, data);
                this.showNotification('Receta actualizada exitosamente', 'success');
            } else {
                await apiService.createReceta(data);
                this.showNotification('Receta creada exitosamente', 'success');
            }

            this.closeModal();
            this.loadData();
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al guardar receta', 'error');
        } finally {
            this.saving = false;
        }
    }

    async handleDelete(e) {
        const receta = e.detail.item;
        
        if (confirm(`¿Estás seguro de eliminar esta receta?`)) {
            try {
                await apiService.deleteReceta(receta.IdReceta);
                this.showNotification('Receta eliminada exitosamente', 'success');
                this.loadData();
            } catch (error) {
                console.error('Error:', error);
                this.showNotification('Error al eliminar receta', 'error');
            }
        }
    }

    showNotification(message, type) {
        alert(message);
    }

    renderModal() {
        if (!this.showModal) return '';

        const receta = this.editingReceta;

        return html`
            <div class="modal-overlay" @click=${this.closeModal}>
                <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                    <div class="modal-header">
                        <h3 class="modal-title">
                            ${receta ? 'Editar Receta' : 'Nueva Receta'}
                        </h3>
                        <button class="btn-close" @click=${this.closeModal}>
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <form @submit=${this.handleSubmit}>
                        <div class="form-group">
                            <label>Consulta *</label>
                            <select name="consulta" required>
                                <option value="">Selecciona una consulta</option>
                                ${this.consultas.map(c => html`
                                    <option 
                                        value="${c.IdConsulta}"
                                        ?selected=${receta?.IdConsulta === c.IdConsulta}>
                                        ${c.NombrePaciente} - ${new Date(c.FechaConsulta).toLocaleDateString('es-ES')}
                                    </option>
                                `)}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Medicamento *</label>
                            <select name="medicamento" required>
                                <option value="">Selecciona un medicamento</option>
                                ${this.medicamentos.map(m => html`
                                    <option 
                                        value="${m.IdMedicamento}"
                                        ?selected=${receta?.IdMedicamento === m.IdMedicamento}>
                                        ${m.Nombre} (${m.Tipo})
                                    </option>
                                `)}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Cantidad *</label>
                            <input 
                                type="number" 
                                name="cantidad" 
                                .value=${receta?.Cantidad || ''}
                                min="1"
                                placeholder="Ej: 30"
                                required>
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
            return html`<loading-spinner text="Cargando recetas..."></loading-spinner>`;
        }

        const columns = [
            { header: 'ID', field: 'IdReceta' },
            { header: 'Paciente', field: 'NombrePaciente' },
            { 
                header: 'Fecha', 
                field: 'FechaConsulta',
                render: (fecha) => new Date(fecha).toLocaleDateString('es-ES')
            },
            { header: 'Medicamento', field: 'NombreMedicamento' },
            { header: 'Tipo', field: 'TipoMedicamento' },
            { header: 'Cantidad', field: 'Cantidad' }
        ];

        return html`
            <div class="page-header">
                <h1 class="page-title">
                    <i class="bi bi-file-medical"></i>
                    ${this.isAdmin ? 'Todas las Recetas' : 'Mis Recetas'}
                </h1>
                <button class="btn-add" @click=${this.openCreateModal}>
                    <i class="bi bi-plus-circle"></i>
                    Nueva Receta
                </button>
            </div>

            <data-table
                title="Registro de Recetas Médicas"
                .columns=${columns}
                .data=${this.recetas}
                @edit=${this.openEditModal}
                @delete=${this.handleDelete}>
            </data-table>

            ${this.renderModal()}
        `;
    }
}

customElements.define('recetas-manager', RecetasManager);