import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import apiService from '../../services/api.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class MedicamentosManager extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    * {
      box-sizing: border-box !important;
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
      max-width: 550px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #E0E6ED;
    }

    .form-group {
      margin-bottom: 20px;
      width: 100%;
    }

    label {
      display: block;
      font-weight: 600;
      color: #2C5282;
      margin-bottom: 8px;
    }

    input, select {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #E0E6ED;
      border-radius: 8px;
      font-size: 0.95rem;
    }

    .detail-row {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid #F0F4F8;
    }
    .detail-label {
      width: 120px;
      font-weight: 700;
      color: #5A7C92;
    }

    .modal-footer {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 25px;
    }

    .btn-primary {
      padding: 10px 25px;
      background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-danger {
      padding: 10px 25px;
      background: linear-gradient(135deg, #DC3545 0%, #C82333 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 3000;
      color: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      animation: slideIn 0.3s ease;
    }
    .success { background: #28a745; }
    .error { background: #dc3545; }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;

  static properties = {
    medicamentos: { type: Array },
    loading: { type: Boolean },
    showModal: { type: Boolean },
    showConfirmModal: { type: Boolean }, // Propiedad para el modal de eliminar
    editingMedicamento: { type: Object },
    viewingMedicamento: { type: Object },
    pendingDeleteItem: { type: Object }, // Guardar ítem a eliminar
    saving: { type: Boolean },
    notification: { type: Object }
  };

  constructor() {
    super();
    this.medicamentos = [];
    this.loading = true;
    this.showModal = false;
    this.showConfirmModal = false;
    this.editingMedicamento = null;
    this.viewingMedicamento = null;
    this.pendingDeleteItem = null;
    this.loadMedicamentos();
  }

  async loadMedicamentos() {
    try {
      this.medicamentos = await apiService.getMedicamentos();
    } catch (error) {
      this.showNotification('Error al cargar datos', 'error');
    } finally {
      this.loading = false;
    }
  }

  showNotification(message, type) {
    this.notification = { message, type };
    setTimeout(() => { this.notification = null; }, 3000);
  }

  // Abre el modal de confirmación en lugar de usar alert
  handleDeleteRequest(e) {
    this.pendingDeleteItem = e.detail.item;
    this.showConfirmModal = true;
  }

  async confirmDelete() {
    try {
      await apiService.deleteMedicamento(this.pendingDeleteItem.IdMedicamento);
      this.showNotification('Medicamento eliminado correctamente', 'success');
      this.showConfirmModal = false;
      this.loadMedicamentos();
    } catch (error) {
      this.showNotification('Error al eliminar', 'error');
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = { nombre: form.nombre.value, tipo: form.tipo.value };
    this.saving = true;
    try {
      if (this.editingMedicamento) {
        await apiService.updateMedicamento(this.editingMedicamento.IdMedicamento, data);
        this.showNotification('Medicamento actualizado', 'success');
      } else {
        await apiService.createMedicamento(data);
        this.showNotification('Medicamento  exitosamente', 'success');
      }
      this.showModal = false;
      this.loadMedicamentos();
    } catch (error) {
      this.showNotification('Error al guardar', 'error');
    } finally {
      this.saving = false;
    }
  }

  renderConfirmModal() {
    if (!this.showConfirmModal) return '';
    return html`
      <div class="modal-overlay" @click=${() => this.showConfirmModal = false}>
        <div class="modal-content" @click=${e => e.stopPropagation()}>
          <div class="modal-header">
            <h3 style="color: #DC3545; margin:0;">Confirmar Eliminación</h3>
          </div>
          <p>¿Estás seguro de que deseas eliminar <strong>${this.pendingDeleteItem?.Nombre}</strong>?</p>
          <div class="modal-footer">
            <button class="btn-primary" style="background: #ccc" @click=${() => this.showConfirmModal = false}>Cancelar</button>
            <button class="btn-danger" @click=${this.confirmDelete}>Eliminar</button>
          </div>
        </div>
      </div>
    `;
  }

  renderViewModal() {
    if (!this.viewingMedicamento) return '';
    const med = this.viewingMedicamento;
    return html`
      <div class="modal-overlay" @click=${() => this.viewingMedicamento = null}>
        <div class="modal-content" @click=${e => e.stopPropagation()}>
          <div class="modal-header">
            <h3 style="color: #0066CC; margin:0;">Detalles</h3>
            <button style="border:none; background:none; cursor:pointer; font-size:1.5rem;" @click=${() => this.viewingMedicamento = null}>&times;</button>
          </div>
          <div class="detail-row"><div class="detail-label">ID:</div><div>${med.IdMedicamento}</div></div>
          <div class="detail-row"><div class="detail-label">Nombre:</div><div>${med.Nombre}</div></div>
          <div class="detail-row"><div class="detail-label">Tipo:</div><div>${med.Tipo}</div></div>
          <div class="modal-footer">
            <button class="btn-primary" @click=${() => this.viewingMedicamento = null}>Cerrar</button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    if (this.loading) return html`<loading-spinner></loading-spinner>`;
    return html`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
      <div class="page-header">
        <h1 class="page-title"><i class="bi bi-capsule"></i> Medicamentos</h1>
        <button class="btn-add" @click=${() => { this.editingMedicamento = null; this.showModal = true; }}>
          <i class="bi bi-plus-circle"></i> Nuevo
        </button>
      </div>

      <data-table
        .columns=${[{header:'ID', field:'IdMedicamento'}, {header:'Nombre', field:'Nombre'}, {header:'Tipo', field:'Tipo'}]}
        .data=${this.medicamentos}
        @view=${(e) => this.viewingMedicamento = e.detail.item}
        @edit=${(e) => { this.editingMedicamento = e.detail.item; this.showModal = true; }}
        @delete=${this.handleDeleteRequest}>
      </data-table>

      ${this.showModal ? html`
        <div class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3 style="color: #0066CC; margin:0;">${this.editingMedicamento ? 'Editar' : 'Nuevo'}</h3>
              <button style="border:none; background:none; cursor:pointer; font-size:1.5rem;" @click=${() => this.showModal = false}>&times;</button>
            </div>
            <form @submit=${this.handleSubmit}>
              <div class="form-group">
                <label>Nombre *</label>
                <input type="text" name="nombre" .value=${this.editingMedicamento?.Nombre || ''} required>
              </div>
              <div class="form-group">
                <label>Tipo *</label>
                <select name="tipo" required>
                  <option value="Tableta" ?selected=${this.editingMedicamento?.Tipo === 'Tableta'}>Tableta</option>
                  <option value="Jarabe" ?selected=${this.editingMedicamento?.Tipo === 'Jarabe'}>Jarabe</option>
                  <option value="Cápsula" ?selected=${this.editingMedicamento?.Tipo === 'Cápsula'}>Cápsula</option>
                </select>
              </div>
              <div class="modal-footer">
                <button type="button" @click=${() => this.showModal = false} class="btn-primary" style="background: #ccc">Cancelar</button>
                <button type="submit" class="btn-primary" ?disabled=${this.saving}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      ` : ''}

      ${this.renderViewModal()}
      ${this.renderConfirmModal()}
      ${this.notification ? html`<div class="notification ${this.notification.type}">${this.notification.message}</div>` : ''}
    `;
  }
}

if (!customElements.get('medicamentos-manager')) {
  customElements.define('medicamentos-manager', MedicamentosManager);
}