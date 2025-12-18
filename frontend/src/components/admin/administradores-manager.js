import { LitElement, html, css } from 'lit';
import apiService from '../../services/api.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class AdministradoresManager extends LitElement {
  static styles = css`
    :host { display: block; }

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

    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
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

    .btn-close:hover { color: #DC3545; }

    .form-group { margin-bottom: 20px; }

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

    .btn-cancel:hover { background: #E9ECEF; }

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

    .note {
      color: #5A7C92;
      font-size: 0.95rem;
    }
  `;

  static properties = {
    administradores: { type: Array },
    loading: { type: Boolean },
    showModal: { type: Boolean },
    modalMode: { type: String }, // 'view' | 'edit'
    selectedAdministrador: { type: Object },
    saving: { type: Boolean }
  };

  constructor() {
    super();
    this.administradores = [];
    this.loading = true;
    this.showModal = false;
    this.modalMode = 'view';
    this.selectedAdministrador = null;
    this.saving = false;
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

  async handleDelete(e) {
    const admin = e.detail.item;

    if (admin.Usuario === 'admin') {
      this.showNotification('No se puede eliminar el administrador principal del sistema', 'error');
      return;
    }

    if (confirm(`¿Estás seguro de eliminar al administrador "${admin.Nombre}"?`)) {
      try {
        await apiService.deleteAdministrador(admin.IdAdministrador);
        this.showNotification('Administrador eliminado exitosamente', 'success');
        this.loadAdministradores();
      } catch (error) {
        console.error('Error:', error);
        this.showNotification('Error al eliminar administrador', 'error');
      }
    }
  }

  showNotification(message, type) {
    alert(message);
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
              ${isView ? 'Ver Administrador' : 'Editar Administrador'}
            </h3>
            <button class="btn-close" @click=${this.closeModal}>
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          ${isView ? html`
            <div class="form-group">
              <label>ID</label>
              <input type="text" .value=${String(admin.IdAdministrador ?? '')} disabled>
            </div>
            <div class="form-group">
              <label>Nombre Completo</label>
              <input type="text" .value=${admin.Nombre || ''} disabled>
            </div>
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input type="text" .value=${admin.Correo || ''} disabled>
            </div>
            <div class="form-group">
              <label>Usuario</label>
              <input type="text" .value=${admin.Usuario || 'Sin usuario'} disabled>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" @click=${this.closeModal}>
                Cerrar
              </button>
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
                <button type="submit" class="btn-save" ?disabled=${this.saving}>
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
      return html`<loading-spinner text="Cargando administradores..."></loading-spinner>`;
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
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="bi bi-shield-check"></i>
            Administradores
          </h1>
          <div class="note">
            El administrador solo puede ver, editar y eliminar. La creación está deshabilitada.
          </div>
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
    `;
  }
}

customElements.define('administradores-manager', AdministradoresManager);
