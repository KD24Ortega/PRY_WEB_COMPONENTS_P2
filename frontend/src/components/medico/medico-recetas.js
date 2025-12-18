import { LitElement, html, css } from 'lit';
import apiService from '../../services/api.service.js';
import authService from '../../services/auth.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class MedicoRecetas extends LitElement {
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
            max-width: 600px;
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

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
        }

        input, select {
            width: 100%;
            padding: 12px;
            border: 2px solid #E0E6ED;
            border-radius: 8px;
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
        recetas: { type: Array },
        consultas: { type: Array },
        medicamentos: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        editingReceta: { type: Object },
        saving: { type: Boolean }
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
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadData();
    }

    async loadData() {
        try {
            const currentUser = authService.getCurrentUser();
            const [consultasData, medicamentosData] = await Promise.all([
                apiService.getConsultasByMedico(currentUser.idMedico),
                apiService.getMedicamentos()
            ]);
            this.consultas = consultasData;
            this.medicamentos = medicamentosData;
            
            const recetasPromises = consultasData.map(c => 
                apiService.getRecetasByConsulta(c.IdConsulta)
            );
            const recetasArrays = await Promise.all(recetasPromises);
            this.recetas = recetasArrays.flat();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar datos');
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
            } else {
                await apiService.createReceta(data);
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
        if (confirm('¿Eliminar receta?')) {
            try {
                await apiService.deleteReceta(e.detail.item.IdReceta);
                this.loadData();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    renderModal() {
        if (!this.showModal) return '';
        const receta = this.editingReceta;

        return html`
            <div class="modal-overlay" @click=${this.closeModal}>
                <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                    <div class="modal-header">
                        <h3>${receta ? 'Editar' : 'Nueva'} Receta</h3>
                        <button @click=${this.closeModal}>✕</button>
                    </div>
                    <form @submit=${this.handleSubmit}>
                        <div class="form-group">
                            <label>Consulta *</label>
                            <select name="consulta" required>
                                <option value="">Selecciona</option>
                                ${this.consultas.map(c => html`
                                    <option value="${c.IdConsulta}" ?selected=${receta?.IdConsulta === c.IdConsulta}>
                                        ${c.NombrePaciente} - ${new Date(c.FechaConsulta).toLocaleDateString('es-ES')}
                                    </option>
                                `)}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Medicamento *</label>
                            <select name="medicamento" required>
                                <option value="">Selecciona</option>
                                ${this.medicamentos.map(m => html`
                                    <option value="${m.IdMedicamento}" ?selected=${receta?.IdMedicamento === m.IdMedicamento}>
                                        ${m.Nombre} (${m.Tipo})
                                    </option>
                                `)}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Cantidad *</label>
                            <input type="number" name="cantidad" .value=${receta?.Cantidad || ''} min="1" required>
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
            return html`<loading-spinner text="Cargando..."></loading-spinner>`;
        }

        const columns = [
            { header: 'ID', field: 'IdReceta' },
            { header: 'Paciente', field: 'NombrePaciente' },
            { header: 'Fecha', field: 'FechaConsulta', render: (f) => f ? new Date(f).toLocaleDateString('es-ES') : 'N/A' },
            { header: 'Medicamento', field: 'NombreMedicamento' },
            { header: 'Tipo', field: 'TipoMedicamento' },
            { header: 'Cantidad', field: 'Cantidad' }
        ];

        return html`
            <div class="page-header">
                <h1 class="page-title">
                    <i class="bi bi-file-medical"></i>
                    Mis Recetas
                </h1>
                <button class="btn-add" @click=${this.openCreateModal}>
                    <i class="bi bi-plus-circle"></i>
                    Nueva Receta
                </button>
            </div>
            <data-table
                title="Registro de Recetas"
                .columns=${columns}
                .data=${this.recetas}
                @edit=${this.openEditModal}
                @delete=${this.handleDelete}>
            </data-table>
            ${this.renderModal()}
        `;
    }
}

customElements.define('medico-recetas', MedicoRecetas);