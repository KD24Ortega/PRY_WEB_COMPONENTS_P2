import { LitElement, html, css } from 'lit';
import apiService from '../../services/api.service.js';
import authService from '../../services/auth.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class MedicoRecetas extends LitElement {
    static styles = css`
        :host { display: block; font-family: 'Poppins', sans-serif; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .page-title { font-size: 2rem; font-weight: 700; color: #0066CC; display: flex; align-items: center; gap: 10px; }
        .btn-add { padding: 12px 24px; background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 2000; backdrop-filter: blur(4px); }
        .modal-content { background: white; border-radius: 16px; padding: 30px; max-width: 550px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #F0F4F8; }
        .form-group { margin-bottom: 15px; }
        label { display: block; font-weight: 600; margin-bottom: 8px; color: #4A5568; }
        input, select, textarea { width: 100%; padding: 12px; border: 2px solid #E2E8F0; border-radius: 8px; box-sizing: border-box; font-family: inherit; }
        textarea { resize: vertical; min-height: 80px; }
        .modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 25px; }
        .btn-cancel { background: #F8F9FA; border: 2px solid #E0E6ED; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
        .btn-save { background: #00B377; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .btn-delete-confirm { background: #DC3545; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
        .view-row { margin-bottom: 15px; padding: 12px; background: #F8FAFC; border-radius: 8px; border: 1px solid #EDF2F7; }
        .view-label { font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
        .view-value { font-size: 1rem; color: #2D3748; font-weight: 500; }
        .toast { position: fixed; bottom: 20px; right: 20px; background: #28a745; color: white; padding: 15px 25px; border-radius: 8px; z-index: 3000; animation: slideIn 0.3s ease-out; display: flex; align-items: center; gap: 10px; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
    `;

    static properties = {
        recetas: { type: Array },
        consultas: { type: Array },
        medicamentos: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        showViewModal: { type: Boolean },
        showDeleteModal: { type: Boolean },
        editingReceta: { type: Object },
        selectedReceta: { type: Object },
        notification: { type: String },
        saving: { type: Boolean }
    };

    constructor() {
        super();
        this.recetas = [];
        this.consultas = [];
        this.medicamentos = [];
        this.loading = true;
        this.showModal = false;
        this.showViewModal = false;
        this.showDeleteModal = false;
        this.editingReceta = null;
        this.selectedReceta = null;
        this.notification = '';
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
            
            const recetasPromises = consultasData.map(c => apiService.getRecetasByConsulta(c.IdConsulta));
            const recetasArrays = await Promise.all(recetasPromises);
            this.recetas = recetasArrays.flat();
        } catch (error) {
            this.showToast('Error al cargar datos');
        } finally {
            this.loading = false;
        }
    }

    showToast(message) {
        this.notification = message;
        setTimeout(() => { this.notification = ''; }, 3000);
    }

    openCreateModal() {
        this.editingReceta = null;
        this.showModal = true;
    }

    openEditModal(e) {
        this.editingReceta = { ...e.detail.item };
        this.showModal = true;
    }

    openViewModal(e) {
        const id = e.detail.item.IdReceta;
        this.selectedReceta = this.recetas.find(r => r.IdReceta === id);
        this.showViewModal = true;
    }

    openDeleteModal(e) {
        this.selectedReceta = e.detail.item;
        this.showDeleteModal = true;
    }

    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        const data = {
            idConsulta: parseInt(formData.get('consulta')),
            idMedicamento: parseInt(formData.get('medicamento')),
            cantidad: parseInt(formData.get('cantidad')),
            instrucciones: formData.get('instrucciones') // Captura del textarea
        };

        this.saving = true;
        try {
            if (this.editingReceta) {
                await apiService.updateReceta(this.editingReceta.IdReceta, data);
                this.showToast(' Receta actualizada');
            } else {
                await apiService.createReceta(data);
                this.showToast(' Receta creada');
            }
            this.showModal = false;
            this.selectedReceta = null;
            this.editingReceta = null;
            await this.loadData();
            
        } catch (error) {
            this.showToast('❌ Error al guardar');
        } finally {
            this.saving = false;
        }
    }

    async confirmDelete() {
        try {
            await apiService.deleteReceta(this.selectedReceta.IdReceta);
            this.showToast('🗑️ Receta eliminada');
            this.showDeleteModal = false;
            this.loadData();
        } catch (error) {
            this.showToast('❌ No se pudo eliminar');
        }
    }

    render() {
        const columns = [
            { header: 'Paciente', field: 'NombrePaciente' },
            { header: 'Medicamento', field: 'NombreMedicamento' },
            { header: 'Cantidad', field: 'Cantidad' }
        ];

        return html`
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
            
            <div class="page-header">
                <h1 class="page-title"><i class="bi bi-file-medical"></i> Gestión de Recetas</h1>
                <button class="btn-add" @click=${this.openCreateModal}>
                    <i class="bi bi-plus-circle"></i> Nueva Receta
                </button>
            </div>

            ${this.loading ? html`<loading-spinner></loading-spinner>` : html`
                <data-table
                    .columns=${columns}
                    .data=${this.recetas}
                    @view=${this.openViewModal}
                    @edit=${this.openEditModal}
                    @delete=${this.openDeleteModal}>
                </data-table>
            `}

            ${this.showModal ? html`
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3><i class="bi bi-pencil-square"></i> ${this.editingReceta ? 'Editar' : 'Nueva'} Receta</h3>
                            <button @click=${() => this.showModal = false} style="border:none; background:none; cursor:pointer; font-size:1.2rem;">✕</button>
                        </div>
                        <form @submit=${this.handleSubmit}>
                            <div class="form-group">
                                <label>Consulta *</label>
                                <select name="consulta" required>
                                    <option value="">Seleccione Paciente</option>
                                    ${this.consultas.map(c => html`
                                        <option value="${c.IdConsulta}" ?selected=${this.editingReceta?.IdConsulta === c.IdConsulta}>
                                            ${c.NombrePaciente} (${new Date(c.FechaConsulta).toLocaleDateString()})
                                        </option>
                                    `)}
                                </select>
                            </div>
                            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 15px;">
                                <div class="form-group">
                                    <label>Medicamento *</label>
                                    <select name="medicamento" required>
                                        <option value="">Seleccione</option>
                                        ${this.medicamentos.map(m => html`
                                            <option value="${m.IdMedicamento}" ?selected=${this.editingReceta?.IdMedicamento === m.IdMedicamento}>
                                                ${m.Nombre}
                                            </option>
                                        `)}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Cantidad *</label>
                                    <input type="number" name="cantidad" .value=${this.editingReceta?.Cantidad || ''} required min="1">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Instrucciones de Uso</label>
                                <textarea name="instrucciones" 
                                    .value=${this.editingReceta?.Instrucciones || ''} 
                                    placeholder="Ej: 1 tableta cada 8 horas por 5 días..."></textarea>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn-cancel" @click=${() => this.showModal = false}>Cancelar</button>
                                <button type="submit" class="btn-save" ?disabled=${this.saving}>
                                    ${this.saving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ` : ''}

            ${this.showViewModal && this.selectedReceta ? html`
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 style="color: #0066CC;"><i class="bi bi-info-circle-fill"></i> Información de la Receta</h3>
                            <button @click=${() => this.showViewModal = false} style="border:none; background:none; cursor:pointer; font-size:1.2rem;">✕</button>
                        </div>
                        <div class="view-row">
                            <div class="view-label">Paciente</div>
                            <div class="view-value">${this.selectedReceta.NombrePaciente}</div>
                        </div>
                        <div class="view-row">
                            <div class="view-label">Medicamento</div>
                            <div class="view-value">${this.selectedReceta.NombreMedicamento}</div>
                        </div>
                        <div class="view-row">
                            <div class="view-label">Cantidad Recetada</div>
                            <div class="view-value">${this.selectedReceta.Cantidad} unidades</div>
                        </div>
                        <div class="view-row" style="border-left: 4px solid #00B377; background: #f0fff4;">
                            <div class="view-label" style="color: #276749;">Instrucciones de Uso</div>
                            <div class="view-value">
                                ${this.selectedReceta.Instrucciones || 'No se ingresaron instrucciones específicas.'}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn-cancel" @click=${() => this.showViewModal = false}>Cerrar Detalle</button>
                        </div>
                    </div>
                </div>
            ` : ''}

            ${this.showDeleteModal ? html`
                <div class="modal-overlay">
                    <div class="modal-content" style="text-align: center;">
                        <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #DC3545;"></i>
                        <h3>¿Eliminar este registro?</h3>
                        <p>¿Seguro que deseas eliminar la receta de <strong>${this.selectedReceta?.NombrePaciente}</strong>?</p>
                        <div class="modal-footer" style="justify-content: center;">
                            <button class="btn-cancel" @click=${() => this.showDeleteModal = false}>Cancelar</button>
                            <button class="btn-delete-confirm" @click=${this.confirmDelete}>Eliminar ahora</button>
                        </div>
                    </div>
                </div>
            ` : ''}

            ${this.notification ? html`<div class="toast"><i class="bi bi-check-circle-fill"></i> ${this.notification}</div>` : ''}
        `;
    }
}

customElements.define('medico-recetas', MedicoRecetas);