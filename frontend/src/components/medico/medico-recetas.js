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

        /* ================= MODALES ================= */

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
            max-width: 600px;
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

        /* ================= FORM ================= */

        .form-group {
            margin-bottom: 20px;
            width: 100%;
        }

        label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: #2C5282;
        }

        input, select {
            width: 100%;
            max-width: 100%;
            padding: 12px;
            border: 2px solid #E0E6ED;
            border-radius: 8px;
            font-family: inherit;
        }

        input:disabled, select:disabled {
            background: #F8F9FA;
        }

        .modal-footer {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
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

        /* ================= VIEW ================= */

        .detail {
            background: #F8F9FA;
            padding: 12px;
            border-radius: 8px;
            font-size: 0.95rem;
            margin-bottom: 12px;
        }
    `;

    static properties = {
        recetas: { type: Array },
        consultas: { type: Array },
        medicamentos: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        modalMode: { type: String }, // view | edit | create
        editingReceta: { type: Object },
        saving: { type: Boolean },
        showConfirm: { type: Boolean },
        pendingDelete: { type: Object }
    };

    constructor() {
        super();
        this.recetas = [];
        this.consultas = [];
        this.medicamentos = [];
        this.loading = true;
        this.showModal = false;
        this.modalMode = 'view';
        this.editingReceta = null;
        this.saving = false;
        this.showConfirm = false;
        this.pendingDelete = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadData();
    }

    async loadData() {
        const user = authService.getCurrentUser();

        const [consultas, medicamentos] = await Promise.all([
            apiService.getConsultasByMedico(user.idMedico),
            apiService.getMedicamentos()
        ]);

        this.consultas = consultas;
        this.medicamentos = medicamentos;

        const recetasArrays = await Promise.all(
            consultas.map(c => apiService.getRecetasByConsulta(c.IdConsulta))
        );

        this.recetas = recetasArrays.flat();
        this.loading = false;
    }

    openViewModal(e) {
        this.editingReceta = e.detail.item;
        this.modalMode = 'view';
        this.showModal = true;
    }

    openEditModal(e) {
        this.editingReceta = e.detail.item;
        this.modalMode = 'edit';
        this.showModal = true;
    }

    openCreateModal() {
        this.editingReceta = null;
        this.modalMode = 'create';
        this.showModal = true;
    }

    openConfirmDelete(e) {
        this.pendingDelete = e.detail.item;
        this.showConfirm = true;
    }

    closeModal() {
        this.showModal = false;
        this.editingReceta = null;
    }

    async confirmDelete() {
        await apiService.deleteReceta(this.pendingDelete.IdReceta);
        this.showConfirm = false;
        this.pendingDelete = null;
        this.loadData();
    }

    async handleSubmit(e) {
        e.preventDefault();
        const f = e.target;

        const data = {
            idConsulta: +f.consulta.value,
            idMedicamento: +f.medicamento.value,
            cantidad: +f.cantidad.value
        };

        this.saving = true;
        if (this.modalMode === 'edit') {
            await apiService.updateReceta(this.editingReceta.IdReceta, data);
        } else {
            await apiService.createReceta(data);
        }
        this.saving = false;
        this.closeModal();
        this.loadData();
    }

    renderConfirmModal() {
        if (!this.showConfirm) return '';

        return html`
        <div class="modal-overlay" @click=${() => this.showConfirm = false}>
            <div class="modal-content" @click=${e => e.stopPropagation()}>
                <div class="modal-header">
                    <h3 class="modal-title">Confirmar eliminación</h3>
                    <button class="btn-close" @click=${() => this.showConfirm = false}>✕</button>
                </div>
                <p>¿Estás seguro de eliminar esta receta?</p>
                <div class="modal-footer">
                    <button class="btn-cancel" @click=${() => this.showConfirm = false}>Cancelar</button>
                    <button class="btn-save" @click=${this.confirmDelete}>Eliminar</button>
                </div>
            </div>
        </div>`;
    }

    renderModal() {
        if (!this.showModal) return '';
        const r = this.editingReceta;
        const view = this.modalMode === 'view';

        return html`
        <div class="modal-overlay" @click=${this.closeModal}>
            <div class="modal-content" @click=${e => e.stopPropagation()}>
                <div class="modal-header">
                    <h3 class="modal-title">${view ? 'Detalle Receta' : 'Receta'}</h3>
                    <button class="btn-close" @click=${this.closeModal}>✕</button>
                </div>

                ${view ? html`
                    <div class="detail"><strong>Paciente:</strong> ${r.NombrePaciente}</div>
                    <div class="detail"><strong>Fecha:</strong> ${new Date(r.FechaConsulta).toLocaleDateString()}</div>
                    <div class="detail"><strong>Medicamento:</strong> ${r.NombreMedicamento}</div>
                    <div class="detail"><strong>Tipo:</strong> ${r.TipoMedicamento}</div>
                    <div class="detail"><strong>Cantidad:</strong> ${r.Cantidad}</div>
                    <div class="modal-footer">
                        <button class="btn-save" @click=${this.closeModal}>Cerrar</button>
                    </div>
                ` : html`
                    <form @submit=${this.handleSubmit}>
                        <div class="form-group">
                            <label>Consulta *</label>
                            <select name="consulta" required>
                                ${this.consultas.map(c => html`
                                    <option value="${c.IdConsulta}" ?selected=${r?.IdConsulta === c.IdConsulta}>
                                        ${c.NombrePaciente} - ${new Date(c.FechaConsulta).toLocaleDateString('es-ES')}
                                    </option>
                                `)}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Medicamento *</label>
                            <select name="medicamento" required>
                                ${this.medicamentos.map(m => html`
                                    <option value="${m.IdMedicamento}" ?selected=${r?.IdMedicamento === m.IdMedicamento}>
                                        ${m.Nombre} (${m.Tipo})
                                    </option>
                                `)}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Cantidad *</label>
                            <input type="number" name="cantidad" min="1" .value=${r?.Cantidad || ''} required>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-cancel" @click=${this.closeModal}>Cancelar</button>
                            <button class="btn-save" ?disabled=${this.saving}>Guardar</button>
                        </div>
                    </form>
                `}
            </div>
        </div>`;
    }

    render() {
        if (this.loading) {
            return html`<loading-spinner text="Cargando recetas..."></loading-spinner>`;
        }

        const columns = [
            { header: 'ID', field: 'IdReceta' },
            { header: 'Paciente', field: 'NombrePaciente' },
            { header: 'Fecha', field: 'FechaConsulta', render: f => new Date(f).toLocaleDateString() },
            { header: 'Medicamento', field: 'NombreMedicamento' },
            { header: 'Tipo', field: 'TipoMedicamento' },
            { header: 'Cantidad', field: 'Cantidad' }
        ];

        return html`
        <div class="page-header">
            <h1 class="page-title"><i class="bi bi-file-medical"></i> Mis Recetas</h1>
            <button class="btn-add" @click=${this.openCreateModal}>
                <i class="bi bi-plus-circle"></i> Nueva Receta
            </button>
        </div>

        <data-table
            .columns=${columns}
            .data=${this.recetas}
            @view=${this.openViewModal}
            @edit=${this.openEditModal}
            @delete=${this.openConfirmDelete}>
        </data-table>

        ${this.renderModal()}
        ${this.renderConfirmModal()}
        `;
    }
}

customElements.define('medico-recetas', MedicoRecetas);
