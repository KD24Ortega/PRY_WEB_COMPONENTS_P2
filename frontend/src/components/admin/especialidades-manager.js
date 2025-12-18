import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import apiService from '../../services/api.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class EspecialidadesManager extends LitElement {
    static styles = css`
        :host { display: block; padding: 20px; }
        * { box-sizing: border-box; }

        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .page-title { font-family: 'Poppins', sans-serif; font-size: 2rem; color: #0066CC; margin: 0; }
        
        .btn-add { 
            padding: 12px 24px; 
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%); 
            color: white; border: none; border-radius: 10px; 
            font-weight: 600; cursor: pointer; transition: 0.3s; 
        }
        .btn-add:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 102, 204, 0.3); }

        /* Modal Styles */
        .modal-overlay { 
            position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
            background: rgba(0, 0, 0, 0.5); display: flex; 
            justify-content: center; align-items: center; z-index: 2000; 
            backdrop-filter: blur(4px); 
        }
        .modal-content { 
            background: white; border-radius: 16px; padding: 30px; 
            width: 100%; max-width: 500px; position: relative;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        
        .form-group { margin-bottom: 20px; }
        label { display: block; font-weight: 600; color: #2C5282; margin-bottom: 8px; }
        input { 
            width: 100%; padding: 12px; border: 2px solid #E0E6ED; 
            border-radius: 8px; font-size: 1rem;
        }
        
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 25px; }
        
        .btn-save { padding: 12px 25px; background: #0066CC; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .btn-cancel { padding: 12px 25px; background: #f4f4f4; color: #666; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .btn-danger { padding: 12px 25px; background: #DC3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }

        /* Detail styles */
        .detail-item { margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0; }
        .detail-label { font-size: 0.85rem; color: #718096; text-transform: uppercase; letter-spacing: 0.05em; }
        .detail-value { font-size: 1.1rem; color: #2D3748; font-weight: 500; }

        .notification { 
            position: fixed; top: 20px; right: 20px; padding: 15px 25px; 
            border-radius: 8px; color: white; z-index: 3000; 
            animation: slideIn 0.3s ease-out;
        }
        .success { background: #28a745; }
        .error { background: #dc3545; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
    `;

    static properties = {
        especialidades: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        showDetailsModal: { type: Boolean },
        showDeleteModal: { type: Boolean },
        editingEspecialidad: { type: Object },
        itemAction: { type: Object },
        saving: { type: Boolean },
        notification: { type: Object }
    };

    constructor() {
        super();
        this.especialidades = [];
        this.loading = true;
        this.showModal = false;
        this.showDetailsModal = false;
        this.showDeleteModal = false;
        this.editingEspecialidad = null;
        this.itemAction = null;
        this.saving = false;
        this.notification = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadEspecialidades();
    }

    async loadEspecialidades() {
        try {
            this.especialidades = await apiService.getEspecialidades();
        } catch (error) {
            this.showNotification('Error al cargar especialidades', 'error');
        } finally {
            this.loading = false;
        }
    }

    showNotification(message, type) {
        this.notification = { message, type };
        setTimeout(() => { this.notification = null; }, 3000);
    }

    async handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            descripcion: formData.get('descripcion'),
            dias: formData.get('dias'),
            franja_hi: formData.get('franja_hi'),
            franja_hf: formData.get('franja_hf')
        };

        this.saving = true;
        try {
            if (this.editingEspecialidad?.IdEspecialidad) {
                await apiService.updateEspecialidad(this.editingEspecialidad.IdEspecialidad, data);
                this.showNotification('Actualización exitosa', 'success');
            } else {
                await apiService.createEspecialidad(data);
                this.showNotification('Creación exitosa', 'success');
            }
            this.showModal = false;
            await this.loadEspecialidades();
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.saving = false;
        }
    }

    handleView(item) {
        this.itemAction = item;
        this.showDetailsModal = true;
    }

    handleDeleteClick(item) {
        this.itemAction = item;
        this.showDeleteModal = true;
    }

    async confirmDelete() {
        try {
            await apiService.deleteEspecialidad(this.itemAction.IdEspecialidad);
            this.showNotification('Registro eliminado', 'success');
            this.showDeleteModal = false;
            this.loadEspecialidades();
        } catch (error) {
            this.showNotification('No se pudo eliminar', 'error');
        }
    }

    render() {
        if (this.loading) return html`<loading-spinner></loading-spinner>`;

        return html`
            <div class="page-header">
                <h1 class="page-title">Gestión de Especialidades</h1>
                <button class="btn-add" @click=${() => { this.editingEspecialidad = null; this.showModal = true; }}>
                    + Nueva Especialidad
                </button>
            </div>

            <data-table
                .columns=${[
                    { header: 'Descripción', field: 'Descripcion' },
                    { header: 'Días', field: 'Dias' },
                    { header: 'Horario', field: 'Franja_HI' }
                ]}
                .data=${this.especialidades}
                @view=${(e) => this.handleView(e.detail.item)}
                @edit=${(e) => { this.editingEspecialidad = e.detail.item; this.showModal = true; }}
                @delete=${(e) => this.handleDeleteClick(e.detail.item)}>
            </data-table>

            ${this.showModal ? this.renderFormModal() : ''}
            ${this.showDetailsModal ? this.renderDetailsModal() : ''}
            ${this.showDeleteModal ? this.renderDeleteModal() : ''}
            
            ${this.notification ? html`
                <div class="notification ${this.notification.type}">${this.notification.message}</div>
            ` : ''}
        `;
    }

    renderFormModal() {
        const esp = this.editingEspecialidad;
        return html`
            <div class="modal-overlay">
                <div class="modal-content">
                    <h2 style="color: #0066CC; margin-top: 0;">${esp ? 'Editar' : 'Nueva'} Especialidad</h2>
                    <form @submit=${this.handleSubmit}>
                        <div class="form-group">
                            <label>Nombre de la Especialidad</label>
                            <input type="text" name="descripcion" .value=${esp?.Descripcion || ''} required>
                        </div>
                        <div class="form-group">
                            <label>Días de Atención</label>
                            <input type="text" name="dias" .value=${esp?.Dias || ''} required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Hora Inicio</label>
                                <input type="time" name="franja_hi" .value=${esp?.Franja_HI || ''} required>
                            </div>
                            <div class="form-group">
                                <label>Hora Fin</label>
                                <input type="time" name="franja_hf" .value=${esp?.Franja_HF || ''} required>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-cancel" @click=${() => this.showModal = false}>Cancelar</button>
                            <button type="submit" class="btn-save" ?disabled=${this.saving}>
                                ${this.saving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    renderDetailsModal() {
        const item = this.itemAction;
        return html`
            <div class="modal-overlay" @click=${() => this.showDetailsModal = false}>
                <div class="modal-content" @click=${e => e.stopPropagation()}>
                    <h2 style="color: #0066CC; margin-top: 0;">Detalles Registrados</h2>
                    
                    <div class="detail-item">
                        <div class="detail-label">Nombre de Especialidad</div>
                        <div class="detail-value">${item.Descripcion}</div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-label">Días de Atención</div>
                        <div class="detail-value">${item.Dias}</div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-label">Horario de Franja</div>
                        <div class="detail-value">${item.Franja_HI} hasta las ${item.Franja_HF}</div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn-save" @click=${() => this.showDetailsModal = false}>Entendido</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderDeleteModal() {
        return html`
            <div class="modal-overlay">
                <div class="modal-content">
                    <h2 style="color: #DC3545; margin-top: 0;">Confirmar eliminación</h2>
                    <p>¿Estás seguro de que deseas eliminar <strong>${this.itemAction?.Descripcion}</strong>?</p>
                    <div class="modal-footer">
                        <button class="btn-cancel" @click=${() => this.showDeleteModal = false}>Cancelar</button>
                        <button class="btn-danger" @click=${this.confirmDelete}>Eliminar ahora</button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('especialidades-manager', EspecialidadesManager);