import { LitElement, html, css } from 'lit';
import apiService from '../../services/api.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class AdministradoresManager extends LitElement {
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
      align-items: flex-start;
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

    .note {
      color: #5A7C92;
      font-size: 0.95rem;
      margin-top: 6px;
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
      max-width: 600px;
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

    input {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #E0E6ED;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    input:focus {
      outline: none;
      border-color: #0066CC;
      box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
    }

    input[disabled] {
      background: #F8F9FA;
      color: #5A7C92;
      cursor: not-allowed;
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

      .modal-title {
        font-size: 1.25rem;
      }
    }
  `;

  static properties = {
    administradores: { type: Array },
    loading: { type: Boolean },
    showModal: { type: Boolean },
    modalMode: { type: String },
    selectedAdministrador: { type: Object },
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
    this.administradores = [];
    this.loading = true;
    this.showModal = false;
    this.modalMode = 'view';
    this.selectedAdministrador = null;
    this.saving = false;
    this.showConfirmModal = false;
    this.confirmTitle = '';
    this.confirmText = '';
    this.pendingDeleteItem = null;
    this.deleting = false;
    this.notification = null;
    this.loadAdministradores();
  }

  async loadAdministradores() {
    try {
      this.administradores = await apiService.getAdministradores();
    } catch (error) {
      console.error('Error al cargar administradores:', error);
      this.showNotification('Error al cargar administradores', 'error');
    } finally {
      this.loading = false;
    }
  }

  openViewModal(e) {
    this.selectedAdministrador = e.detail.item;
    this.modalMode = 'view';
    this.showModal = true;
  }

  openEditModal(e) {
    this.selectedAdministrador = e.detail.item;
    this.modalMode = 'edit';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedAdministrador = null;
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

    if (!this.selectedAdministrador) {
      this.showNotification('No hay administrador seleccionado para editar', 'error');
      return;
    }

    const form = e.target;
    const data = {
      nombre: form.nombre.value,
      correo: form.correo.value
    };

    this.saving = true;

    try {
      await apiService.updateAdministrador(this.selectedAdministrador.IdAdministrador, data);
      this.showNotification('Administrador actualizado exitosamente', 'success');
      this.closeModal();
      this.loadAdministradores();
    } catch (error) {
      console.error('Error:', error);
      this.showNotification('Error al guardar administrador', 'error');
    } finally {
      this.saving = false;
    }
  }

  handleDelete(e) {
    const admin = e.detail.item;

    if (admin.Usuario === 'admin') {
      this.showNotification('No se puede eliminar el administrador principal del sistema', 'error');
      return;
    }

    this.openConfirmDelete(
      admin,
      'Confirmar eliminación',
      `¿Estás seguro de eliminar al administrador "${admin.Nombre}"?`
    );
  }

  async confirmDelete() {
    const admin = this.pendingDeleteItem;
    if (!admin) return;

    this.deleting = true;

    try {
      await apiService.deleteAdministrador(admin.IdAdministrador);
      this.showNotification('Administrador eliminado exitosamente', 'success');
      this.closeConfirm();
      this.loadAdministradores();
    } catch (error) {
      console.error('Error:', error);
      this.showNotification('Error al eliminar administrador', 'error');
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
    if (!this.showModal || !this.selectedAdministrador) return '';

    const admin = this.selectedAdministrador;
    const isView = this.modalMode === 'view';

    return html`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
      <div class="modal-overlay" @click=${this.closeModal}>
        <div class="modal-content" @click=${(e) => e.stopPropagation()}>
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="bi bi-${isView ? 'eye' : 'pencil'}"></i>
              ${isView ? 'Ver Administrador' : 'Editar Administrador'}
            </h3>
            <button class="btn-close" @click=${this.closeModal}>
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          ${isView ? html`
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">ID</span>
                <span class="detail-value">${admin.IdAdministrador}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Nombre Completo</span>
                <span class="detail-value">${admin.Nombre}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Correo Electrónico</span>
                <span class="detail-value">${admin.Correo}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Usuario</span>
                <span class="detail-value">${admin.Usuario || 'Sin usuario'}</span>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn-primary" @click=${this.closeModal}>Cerrar</button>
            </div>
          ` : html`
            <form @submit=${this.handleSubmit}>
              <div class="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  name="nombre"
                  .value=${admin.Nombre || ''}
                  placeholder="María García"
                  required>
              </div>

              <div class="form-group">
                <label>Correo Electrónico *</label>
                <input
                  type="email"
                  name="correo"
                  .value=${admin.Correo || ''}
                  placeholder="admin@clinica.com"
                  required>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn-cancel" @click=${this.closeModal}>
                  Cancelar
                </button>
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
        <loading-spinner text="Cargando administradores..."></loading-spinner>
      `;
    }

    const columns = [
      { header: 'ID', field: 'IdAdministrador' },
      { header: 'Nombre', field: 'Nombre' },
      { header: 'Correo', field: 'Correo' },
      {
        header: 'Usuario',
        field: 'Usuario',
        render: (usuario) => usuario || html`<span style="color: #95A5A6;">Sin usuario</span>`
      }
    ];

    return html`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="bi bi-shield-check"></i>
            Administradores
          </h1>
          <div class="note">El administrador solo puede ver, editar y eliminar. La creación está deshabilitada.</div>
        </div>
      </div>

      <data-table
        title="Listado de Administradores"
        .columns=${columns}
        .data=${this.administradores}
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

customElements.define('administradores-manager', AdministradoresManager);