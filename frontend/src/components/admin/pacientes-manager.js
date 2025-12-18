import { LitElement, html, css } from 'lit';
import apiService from '../../services/api.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class PacientesManager extends LitElement {
  static styles = css`
    :host { display: block; }

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
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
      backdrop-filter: blur(4px);
      padding: 12px;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      padding: 26px;
      max-width: 760px;
      width: 100%;
      max-height: 92vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      padding-bottom: 12px;
      border-bottom: 2px solid #E0E6ED;
      gap: 12px;
    }

    .modal-title {
      font-family: 'Poppins', sans-serif;
      font-size: 1.35rem;
      font-weight: 700;
      color: #0066CC;
      margin: 0;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.35rem;
      cursor: pointer;
      color: #5A7C92;
      transition: all 0.3s ease;
    }

    .btn-close:hover { color: #DC3545; }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }

    .form-group { margin-bottom: 6px; }
    .full-width { grid-column: 1 / -1; }

    label {
      display: block;
      font-weight: 600;
      color: #2C5282;
      margin-bottom: 8px;
      font-size: 0.95rem;
    }

    input, select {
      width: 100%;
      padding: 12px 14px;
      border: 2px solid #E0E6ED;
      border-radius: 10px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
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
      margin-top: 18px;
      padding-top: 16px;
      border-top: 2px solid #E0E6ED;
      flex-wrap: wrap;
    }

    .btn-cancel {
      padding: 10px 18px;
      background: #F8F9FA;
      color: #5A7C92;
      border: 2px solid #E0E6ED;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-cancel:hover { background: #E9ECEF; }

    .btn-primary {
      padding: 10px 18px;
      background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(0, 102, 204, 0.25);
    }

    .btn-danger {
      padding: 10px 18px;
      background: #DC3545;
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-danger:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(220, 53, 69, 0.22);
    }

    .btn-primary:disabled, .btn-danger:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .msg-box {
      padding: 14px;
      border-radius: 12px;
      border: 1px solid #E0E6ED;
      background: #F8F9FA;
      color: #2C5282;
      display: flex;
      gap: 12px;
      align-items: flex-start;
      line-height: 1.35;
    }

    .msg-icon {
      font-size: 1.35rem;
      line-height: 1;
      margin-top: 2px;
    }

    .msg-title {
      font-weight: 800;
      margin: 0 0 4px 0;
    }

    .msg-text {
      margin: 0;
      color: #2C5282;
    }

    .msg-success { border-color: rgba(25, 135, 84, 0.35); background: rgba(25, 135, 84, 0.08); }
    .msg-error { border-color: rgba(220, 53, 69, 0.35); background: rgba(220, 53, 69, 0.08); }
    .msg-info { border-color: rgba(13, 110, 253, 0.35); background: rgba(13, 110, 253, 0.08); }

    .summary {
      margin-top: 14px;
      padding: 12px;
      border-radius: 12px;
      background: rgba(0, 217, 255, 0.08);
      border: 1px solid rgba(0, 217, 255, 0.25);
      color: #2C5282;
      font-size: 0.95rem;
    }
  `;

  static properties = {
    pacientes: { type: Array },
    loading: { type: Boolean },

    showModal: { type: Boolean },
    modalMode: { type: String }, // view | edit
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
    deleting: { type: Boolean }
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

    this.loadPacientes();
  }

  async loadPacientes() {
    try {
      this.pacientes = await apiService.getPacientes();
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      this.showMessage('error', 'Error', 'Error al cargar pacientes');
    } finally {
      this.loading = false;
    }
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
      this.showMessage('success', 'Éxito', 'Paciente actualizado exitosamente');
      this.closeModal();
      this.loadPacientes();
    } catch (error) {
      console.error('Error:', error);
      this.showMessage('error', 'Error', 'Error al guardar paciente');
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
      this.showMessage('success', 'Éxito', 'Paciente eliminado exitosamente');
      this.closeConfirm();
      this.loadPacientes();
    } catch (error) {
      console.error('Error:', error);
      this.showMessage('error', 'Error', 'Error al eliminar paciente');
      this.closeConfirm();
    } finally {
      this.deleting = false;
    }
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
      <div class="modal-overlay" @click=${this.closeMessage}>
        <div class="modal-content" @click=${(e) => e.stopPropagation()}>
          <div class="modal-header">
            <h3 class="modal-title">${this.msgTitle || 'Mensaje'}</h3>
            <button class="btn-close" @click=${this.closeMessage}>
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class=${boxClass}>
            <i class="bi ${icon} msg-icon"></i>
            <div>
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
      <div class="modal-overlay" @click=${this.closeConfirm}>
        <div class="modal-content" @click=${(e) => e.stopPropagation()}>
          <div class="modal-header">
            <h3 class="modal-title">${this.confirmTitle || 'Confirmación'}</h3>
            <button class="btn-close" @click=${this.closeConfirm}>
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="msg-box msg-error">
            <i class="bi bi-exclamation-triangle-fill msg-icon"></i>
            <div>
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
      <div class="modal-overlay" @click=${this.closeModal}>
        <div class="modal-content" @click=${(e) => e.stopPropagation()}>
          <div class="modal-header">
            <h3 class="modal-title">${isView ? 'Ver Paciente' : 'Editar Paciente'}</h3>
            <button class="btn-close" @click=${this.closeModal}>
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          ${isView ? html`
            <div class="form-grid">
              <div class="form-group">
                <label>ID</label>
                <input type="text" .value=${String(paciente.IdPaciente ?? '')} disabled>
              </div>

              <div class="form-group">
                <label>Nombre</label>
                <input type="text" .value=${paciente.Nombre || ''} disabled>
              </div>

              <div class="form-group">
                <label>Cédula</label>
                <input type="text" .value=${paciente.Cedula || ''} disabled>
              </div>

              <div class="form-group">
                <label>Edad</label>
                <input type="text" .value=${String(paciente.Edad ?? '')} disabled>
              </div>

              <div class="form-group">
                <label>Género</label>
                <input type="text" .value=${paciente.Genero || ''} disabled>
              </div>

              <div class="form-group">
                <label>Estatura (cm)</label>
                <input type="text" .value=${String(paciente.Estatura ?? '')} disabled>
              </div>

              <div class="form-group">
                <label>Peso (kg)</label>
                <input type="text" .value=${String(paciente.Peso ?? '')} disabled>
              </div>

              <div class="form-group full-width">
                <label>Foto</label>
                <input type="text" .value=${paciente.Foto || ''} disabled>
              </div>
            </div>

            <div class="summary">
              <i class="bi bi-activity me-2"></i>
              IMC: <b>${imc ? imc.toFixed(2) : 'N/A'}</b>
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
                  <input type="number" name="edad" .value=${paciente.Edad ?? ''} min="0" max="150">
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
                  <input type="number" name="estatura" .value=${paciente.Estatura ?? ''} min="0" max="300">
                </div>

                <div class="form-group">
                  <label>Peso (kg)</label>
                  <input type="number" name="peso" .value=${paciente.Peso ?? ''} min="0" max="500" step="0.1">
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
      return html`<loading-spinner text="Cargando pacientes..."></loading-spinner>`;
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
          if (item.Estatura > 0) {
            const imc = (Number(peso) || 0) / Math.pow((Number(item.Estatura) || 0) / 100, 2);
            return imc.toFixed(2);
          }
          return 'N/A';
        }
      }
    ];

    return html`
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
    `;
  }
}

customElements.define('pacientes-manager', PacientesManager);
