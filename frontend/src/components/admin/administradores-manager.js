import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import apiService from '../../services/api.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class AdministradoresManager extends LitElement {
  static styles = css`
    :host { display: block; padding: 20px; }
    * { box-sizing: border-box; }

    .page-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 30px; flex-wrap: wrap; gap: 15px;
    }

    .page-title {
      font-family: 'Poppins', sans-serif; font-size: 2rem;
      font-weight: 700; color: #0066CC; display: flex;
      align-items: center; gap: 10px; margin: 0;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.5); display: flex;
      justify-content: center; align-items: center; z-index: 2000;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      background: white; border-radius: 16px; padding: 30px;
      max-width: 600px; width: 90%; max-height: 90vh;
      overflow-y: auto; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: relative;
    }

    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #E0E6ED;
    }

    .modal-title {
      font-family: 'Poppins', sans-serif; font-size: 1.5rem;
      font-weight: 600; color: #0066CC; margin: 0;
    }

    .btn-close {
      background: none; border: none; font-size: 1.5rem;
      cursor: pointer; color: #5A7C92; transition: 0.3s;
    }
    .btn-close:hover { color: #DC3545; }

    .form-group { margin-bottom: 20px; }
    label { display: block; font-weight: 600; color: #2C5282; margin-bottom: 8px; font-size: 0.95rem; }

    input {
      width: 100%; padding: 12px 15px; border: 2px solid #E0E6ED;
      border-radius: 8px; font-size: 0.95rem; transition: 0.3s;
    }
    input:focus { outline: none; border-color: #0066CC; box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1); }
    input[disabled] { background: #F8F9FA; color: #5A7C92; cursor: not-allowed; }

    .modal-footer {
      display: flex; gap: 10px; justify-content: flex-end;
      margin-top: 25px; padding-top: 20px; border-top: 2px solid #E0E6ED;
    }

    .btn-cancel {
      padding: 10px 20px; background: #F8F9FA; color: #5A7C92;
      border: 2px solid #E0E6ED; border-radius: 8px; font-weight: 600;
      cursor: pointer; transition: 0.3s;
    }
    .btn-cancel:hover { background: #E9ECEF; }

    .btn-save {
      padding: 10px 20px; background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
      color: white; border: none; border-radius: 8px; font-weight: 600;
      cursor: pointer; transition: 0.3s;
    }
    .btn-save:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3); }

    .btn-danger {
      padding: 10px 20px; background: #DC3545; color: white;
      border: none; border-radius: 8px; font-weight: 600;
      cursor: pointer; transition: 0.3s;
    }

    .note { color: #5A7C92; font-size: 0.95rem; margin-top: 5px; }

    /* Notification simple */
    .toast {
      position: fixed; top: 20px; right: 20px; padding: 15px 25px;
      border-radius: 8px; color: white; z-index: 3000; font-weight: 600;
    }
    .success { background: #28a745; }
    .error { background: #dc3545; }
  `;

  static properties = {
    administradores: { type: Array },
    loading: { type: Boolean },
    showModal: { type: Boolean },
    showDeleteModal: { type: Boolean },
    modalMode: { type: String },
    selectedAdministrador: { type: Object },
    saving: { type: Boolean },
    notification: { type: Object }
  };

  constructor() {
    super();
    this.administradores = [];
    this.loading = true;
    this.showModal = false;
    this.showDeleteModal = false;
    this.modalMode = 'view';
    this.selectedAdministrador = null;
    this.saving = false;
    this.notification = null;
    this.loadAdministradores();
  }

  async loadAdministradores() {
    try {
      this.administradores = await apiService.getAdministradores();
    } catch (error) {
      this.showNotification('Error al cargar administradores', 'error');
    } finally {
      this.loading = false;
    }
  }

  showNotification(message, type) {
    this.notification = { message, type };
    setTimeout(() => { this.notification = null; }, 3000);
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

  handleDeleteClick(e) {
    const admin = e.detail.item;
    if (admin.Usuario === 'admin') {
      this.showNotification('No se puede eliminar el administrador principal', 'error');
      return;
    }
    this.selectedAdministrador = admin;
    this.showDeleteModal = true;
  }

  async confirmDelete() {
    try {
      await apiService.deleteAdministrador(this.selectedAdministrador.IdAdministrador);
      this.showNotification('Administrador eliminado', 'success');
      this.showDeleteModal = false;
      this.loadAdministradores();
    } catch (error) {
      this.showNotification('Error al eliminar', 'error');
    }
  }

  closeModal() {
    this.showModal = false;
    this.showDeleteModal = false;
    this.selectedAdministrador = null;
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      nombre: form.nombre.value,
      correo: form.correo.value
    };

    this.saving = true;
    try {
      await apiService.updateAdministrador(this.selectedAdministrador.IdAdministrador, data);
      this.showNotification('Actualizado exitosamente', 'success');
      this.closeModal();
      this.loadAdministradores();
    } catch (error) {
      this.showNotification('Error al guardar', 'error');
    } finally {
      this.saving = false;
    }
  }

  render() {
    if (this.loading) {
      return html`<loading-spinner text="Cargando administradores..."></loading-spinner>`;
    }

    return html`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
      
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="bi bi-shield-check"></i>
            Administradores
          </h1>
          <div class="note">
            Gestión de perfiles administrativos. La creación de nuevos registros está restringida.
          </div>
        </div>
      </div>

      <data-table
        .columns=${[
          { header: 'ID', field: 'IdAdministrador' },
          { header: 'Nombre', field: 'Nombre' },
          { header: 'Correo', field: 'Correo' },
          { header: 'Usuario', field: 'Usuario' }
        ]}
        .data=${this.administradores}
        @view=${this.openViewModal}
        @edit=${this.openEditModal}
        @delete=${this.handleDeleteClick}>
      </data-table>

      ${this.showModal ? this.renderModal() : ''}
      ${this.showDeleteModal ? this.renderDeleteModal() : ''}
      
      ${this.notification ? html`
        <div class="toast ${this.notification.type}">${this.notification.message}</div>
      ` : ''}
    `;
  }

  renderModal() {
    const admin = this.selectedAdministrador;
    const isView = this.modalMode === 'view';

    return html`
      <div class="modal-overlay" @click=${this.closeModal}>
        <div class="modal-content" @click=${(e) => e.stopPropagation()}>
          <div class="modal-header">
            <h3 class="modal-title">${isView ? 'Detalles' : 'Editar'} Administrador</h3>
            <button class="btn-close" @click=${this.closeModal}><i class="bi bi-x-lg"></i></button>
          </div>

          <form @submit=${this.handleSubmit}>
            <div class="form-group">
              <label>Nombre Completo</label>
              <input type="text" name="nombre" .value=${admin.Nombre || ''} ?disabled=${isView} required>
            </div>
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input type="email" name="correo" .value=${admin.Correo || ''} ?disabled=${isView} required>
            </div>
            <div class="form-group">
              <label>Nombre de Usuario</label>
              <input type="text" .value=${admin.Usuario || ''} disabled>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" @click=${this.closeModal}>
                ${isView ? 'Cerrar' : 'Cancelar'}
              </button>
              ${!isView ? html`
                <button type="submit" class="btn-save" ?disabled=${this.saving}>
                  ${this.saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              ` : ''}
            </div>
          </form>
        </div>
      </div>
    `;
  }

  renderDeleteModal() {
    return html`
      <div class="modal-overlay">
        <div class="modal-content" style="max-width: 450px;">
          <h2 style="color: #DC3545; margin-top: 0;">¿Confirmar eliminación?</h2>
          <p>Estás a punto de eliminar al administrador: <br>
             <strong>${this.selectedAdministrador?.Nombre}</strong></p>
          <div class="modal-footer">
            <button class="btn-cancel" @click=${this.closeModal}>Cancelar</button>
            <button class="btn-danger" @click=${this.confirmDelete}>Eliminar ahora</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('administradores-manager', AdministradoresManager);