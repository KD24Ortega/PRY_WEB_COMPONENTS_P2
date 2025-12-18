import { LitElement, html, css } from 'lit';
import apiService from '../../services/api.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class PacientesManager extends LitElement {
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
      max-width: 800px;
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

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .form-group {
      margin-bottom: 0;
    }

    .full-width {
      grid-column: 1 / -1;
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
      font-family: inherit;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #0066CC;
      box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
    }

    input[disabled], select[disabled] {
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

    .btn-danger {
      padding: 10px 20px;
      background: linear-gradient(135deg, #DC3545 0%, #C82333 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-danger:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    }

    .btn-primary:disabled, .btn-danger:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
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

    .msg-success {
      border-color: #28a745;
      background: rgba(40, 167, 69, 0.1);
      color: #155724;
    }

    .msg-error {
      border-color: #dc3545;
      background: rgba(220, 53, 69, 0.1);
      color: #721c24;
    }

    .msg-info {
      border-color: #17a2b8;
      background: rgba(23, 162, 184, 0.1);
      color: #0c5460;
    }

    .summary {
      margin-top: 20px;
      padding: 15px;
      border-radius: 8px;
      background: rgba(0, 217, 255, 0.1);
      border: 1px solid rgba(0, 217, 255, 0.3);
      color: #2C5282;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
      .form-grid, .detail-grid {
        grid-template-columns: 1fr;
      }

      .modal-content {
        padding: 20px;
      }

      .modal-title {
        font-size: 1.25rem;
      }
    }
  `;

  static properties = {
    pacientes: { type: Array },
    loading: { type: Boolean },
    showModal: { type: Boolean },
    modalMode: { type: String },
    selectedPaciente: { type: Object },
    saving: { type: Boolean },
    showMsgModal: { type: Boolean },
    msgType: { type: String },
    msgTitle: { type: String },
    msgText: { type: String },
    showConfirmModal: { type: Boolean },
    confirmTitle: { type: String },
    confirmText: { type: String },
    pendingDeleteItem: { type: Object },
    deleting: { type: Boolean },
    notification: { type: Object }
  };

  constructor() {
    super();
    this.pacientes = [];
    this.loading = true;
    this.showModal = false;
    this.modalMode = 'view';
    this.selectedPaciente = null;
    this.saving = false;
    this.showMsgModal = false;
    this.msgType = 'info';
    this.msgTitle = '';
    this.msgText = '';
    this.showConfirmModal = false;
    this.confirmTitle = '';
    this.confirmText = '';
    this.pendingDeleteItem = null;
    this.deleting = false;
    this.notification = null;
    this.loadPacientes();
  }

  async loadPacientes() {
    try {
      this.pacientes = await apiService.getPacientes();
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      this.showNotification('Error al cargar pacientes', 'error');
    } finally {
      this.loading = false;
    }
  }

  showNotification(message, type) {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  showMessage(type, title, text) {
    this.msgType = type;
    this.msgTitle = title;
    this.msgText = text;
    this.showMsgModal = true;
  }

  closeMessage() {
    this.showMsgModal = false;
    this.msgTitle = '';
    this.msgText = '';
    this.msgType = 'info';
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

  openViewModal(e) {
    this.selectedPaciente = e.detail.item;
    this.modalMode = 'view';
    this.showModal = true;
  }

  openEditModal(e) {
    this.selectedPaciente = e.detail.item;
    this.modalMode = 'edit';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedPaciente = null;
    this.modalMode = 'view';
  }

  calcIMC(peso, estaturaCm) {
    const estaturaM = (Number(estaturaCm) || 0) / 100;
    const p = Number(peso) || 0;
    if (estaturaM <= 0) return null;
    return p / (estaturaM * estaturaM);
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.selectedPaciente) {
      this.showMessage('error', 'Error', 'No hay paciente seleccionado para editar');
      return;
    }

    const form = e.target;
    const data = {
      nombre: form.nombre.value,
      cedula: form.cedula.value,
      edad: parseInt(form.edad.value) || 0,
      genero: form.genero.value,
      estatura: parseInt(form.estatura.value) || 0,
      peso: parseFloat(form.peso.value) || 0,
      foto: form.foto.value || 'default.jpg'
    };

    this.saving = true;

    try {
      await apiService.updatePaciente(this.selectedPaciente.IdPaciente, data);
      this.showNotification('Paciente actualizado exitosamente', 'success');
      this.closeModal();
      this.loadPacientes();
    } catch (error) {
      console.error('Error:', error);
      this.showNotification('Error al guardar paciente', 'error');
    } finally {
      this.saving = false;
    }
  }

  handleDelete(e) {
    const paciente = e.detail.item;
    this.openConfirmDelete(
      paciente,
      'Confirmar eliminación',
      `¿Estás seguro de eliminar al paciente "${paciente.Nombre}"?`
    );
  }

  async confirmDelete() {
    const paciente = this.pendingDeleteItem;
    if (!paciente) return;

    this.deleting = true;

    try {
      await apiService.deletePaciente(paciente.IdPaciente);
      this.showNotification('Paciente eliminado exitosamente', 'success');
      this.closeConfirm();
      this.loadPacientes();
    } catch (error) {
      console.error('Error:', error);
      this.showNotification('Error al eliminar paciente', 'error');
      this.closeConfirm();
    } finally {
      this.deleting = false;
    }
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

  renderMessageModal() {
    if (!this.showMsgModal) return '';

    const icon =
      this.msgType === 'success' ? 'bi-check-circle-fill' :
      this.msgType === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill';

    const boxClass =
      this.msgType === 'success' ? 'msg-box msg-success' :
      this.msgType === 'error' ? 'msg-box msg-error' : 'msg-box msg-info';

    return html`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
      <div class="modal-overlay" @click=${this.closeMessage}>
        <div class="modal-content" @click=${(e) => e.stopPropagation()}>
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="bi ${icon}"></i>
              ${this.msgTitle || 'Mensaje'}
            </h3>
            <button class="btn-close" @click=${this.closeMessage}>
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class=${boxClass}>
            <i class="bi ${icon} msg-icon"></i>
            <div class="msg-content">
              <p class="msg-title">${this.msgTitle || 'Mensaje'}</p>
              <p class="msg-text">${this.msgText}</p>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-primary" @click=${this.closeMessage}>Aceptar</button>
          </div>
        </div>
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
            <button class="btn-danger" ?disabled=${this.deleting} @click=${this.confirmDelete}>
              ${this.deleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderViewEditModal() {
    if (!this.showModal || !this.selectedPaciente) return '';

    const paciente = this.selectedPaciente;
    const isView = this.modalMode === 'view';
    const imc = this.calcIMC(paciente.Peso, paciente.Estatura);

    return html`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
      <div class="modal-overlay" @click=${this.closeModal}>
        <div class="modal-content" @click=${(e) => e.stopPropagation()}>
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="bi bi-${isView ? 'eye' : 'pencil'}"></i>
              ${isView ? 'Ver Paciente' : 'Editar Paciente'}
            </h3>
            <button class="btn-close" @click=${this.closeModal}>
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          ${isView ? html`
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">ID</span>
                <span class="detail-value">${paciente.IdPaciente}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Nombre</span>
                <span class="detail-value">${paciente.Nombre}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Cédula</span>
                <span class="detail-value">${paciente.Cedula}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Edad</span>
                <span class="detail-value">${paciente.Edad} años</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Género</span>
                <span class="detail-value">${paciente.Genero}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Estatura</span>
                <span class="detail-value">${paciente.Estatura} cm</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Peso</span>
                <span class="detail-value">${paciente.Peso} kg</span>
              </div>
              <div class="detail-item full-width">
                <span class="detail-label">Foto</span>
                <span class="detail-value">${paciente.Foto}</span>
              </div>
            </div>

            <div class="summary">
              <i class="bi bi-activity"></i>
              <strong>IMC:</strong> ${imc ? imc.toFixed(2) : 'N/A'}
            </div>

            <div class="modal-footer">
              <button class="btn-primary" @click=${this.closeModal}>Cerrar</button>
            </div>
          ` : html`
            <form @submit=${this.handleSubmit}>
              <div class="form-grid">
                <div class="form-group">
                  <label>Nombre Completo *</label>
                  <input type="text" name="nombre" .value=${paciente.Nombre || ''} required>
                </div>
                <div class="form-group">
                  <label>Cédula *</label>
                  <input type="text" name="cedula" .value=${paciente.Cedula || ''} required>
                </div>
                <div class="form-group">
                  <label>Edad</label>
                  <input type="number" name="edad" .value=${String(paciente.Edad ?? '')} min="0" max="150">
                </div>
                <div class="form-group">
                  <label>Género</label>
                  <select name="genero">
                    <option value="Masculino" ?selected=${paciente.Genero === 'Masculino'}>Masculino</option>
                    <option value="Femenino" ?selected=${paciente.Genero === 'Femenino'}>Femenino</option>
                    <option value="Otro" ?selected=${paciente.Genero === 'Otro'}>Otro</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Estatura (cm)</label>
                  <input type="number" name="estatura" .value=${String(paciente.Estatura ?? '')} min="0" max="300">
                </div>
                <div class="form-group">
                  <label>Peso (kg)</label>
                  <input type="number" name="peso" .value=${String(paciente.Peso ?? '')} min="0" max="500" step="0.1">
                </div>
                <div class="form-group full-width">
                  <label>Foto (URL o nombre de archivo)</label>
                  <input type="text" name="foto" .value=${paciente.Foto || ''} placeholder="default.jpg">
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn-cancel" @click=${this.closeModal}>Cancelar</button>
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
        <loading-spinner text="Cargando pacientes..."></loading-spinner>
      `;
    }

    const columns = [
      { header: 'ID', field: 'IdPaciente' },
      { header: 'Nombre', field: 'Nombre' },
      { header: 'Cédula', field: 'Cedula' },
      { header: 'Edad', field: 'Edad' },
      { header: 'Género', field: 'Genero' },
      {
        header: 'IMC',
        field: 'Peso',
        render: (peso, item) => {
          const imc = this.calcIMC(peso, item.Estatura);
          return imc ? imc.toFixed(2) : 'N/A';
        }
      }
    ];

    return html`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="bi bi-people"></i>
            Pacientes
          </h1>
          <div class="note">El administrador solo puede ver, editar y eliminar. La creación está deshabilitada.</div>
        </div>
      </div>

      <data-table
        title="Listado de Pacientes"
        .columns=${columns}
        .data=${this.pacientes}
        @view=${this.openViewModal}
        @edit=${this.openEditModal}
        @delete=${this.handleDelete}>
      </data-table>

      ${this.renderViewEditModal()}
      ${this.renderConfirmModal()}
      ${this.renderMessageModal()}
      ${this.renderNotification()}
    `;
  }
}

customElements.define('pacientes-manager', PacientesManager);