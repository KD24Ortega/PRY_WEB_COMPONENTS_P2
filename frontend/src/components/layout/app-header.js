import { LitElement, html, css } from 'lit';
import authService from '../../services/auth.service.js';

class AppHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .header {
      background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
      color: white;
      padding: 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    /* ===== Layout principal ===== */
    .bar {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 16px;
      padding: 0.9rem 1.25rem;
      min-height: 68px;
    }

    .left,
    .center,
    .right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .left { justify-content: flex-start; }
    .center { justify-content: center; }
    .right { justify-content: flex-end; }

    .brand {
      font-family: 'Poppins', sans-serif;
      font-size: 1.35rem;
      font-weight: 800;
      color: white;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      user-select: none;
      white-space: nowrap;
    }

    .brand:hover { opacity: 0.92; }

    .subtitle {
      font-size: 0.85rem;
      opacity: 0.9;
      font-weight: 500;
      margin-left: 4px;
      white-space: nowrap;
    }

    /* ===== Botón sidebar ===== */
    .sidebar-toggle {
      background: rgba(255, 255, 255, 0.18);
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: white;
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.25s ease;
      flex: 0 0 auto;
    }

    .sidebar-toggle:hover { background: rgba(255, 255, 255, 0.28); }

    /* ===== Usuario ===== */
    .user {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 6px 10px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.14);
      border: 1px solid rgba(255, 255, 255, 0.22);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: white;
      display: grid;
      place-items: center;
      font-weight: 800;
      color: #0066CC;
      font-size: 1.05rem;
      flex: 0 0 auto;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
      min-width: 160px;
    }

    .user-name {
      font-weight: 700;
      font-size: 0.95rem;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .role-badge {
      width: fit-content;
      margin-top: 6px;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    .role-admin {
      background: rgba(255, 193, 7, 0.18);
      color: #FFC107;
      border: 1px solid rgba(255, 193, 7, 0.45);
    }

    .role-medico {
      background: rgba(0, 229, 160, 0.18);
      color: #00E5A0;
      border: 1px solid rgba(0, 229, 160, 0.45);
    }

    .role-paciente {
      background: rgba(255, 255, 255, 0.18);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.45);
    }

    /* ===== Logout ===== */
    .btn-logout {
      background: rgba(255, 255, 255, 0.18);
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: white;
      padding: 0.55rem 1rem;
      border-radius: 999px;
      font-weight: 700;
      transition: all 0.25s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      cursor: pointer;
    }

    .btn-logout:hover {
      background: white;
      color: #0066CC;
      transform: translateY(-1px);
      box-shadow: 0 10px 18px rgba(0, 0, 0, 0.15);
    }

    /* ===== Modales (mensaje + confirm) ===== */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.52);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3000;
      backdrop-filter: blur(4px);
      padding: 12px;
    }

    .modal-content {
      background: white;
      color: #1F2A37;
      border-radius: 16px;
      width: 100%;
      max-width: 520px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }

    .modal-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 16px 18px;
      border-bottom: 2px solid #E0E6ED;
    }

    .modal-title {
      margin: 0;
      font-family: 'Poppins', sans-serif;
      font-size: 1.15rem;
      font-weight: 800;
      color: #0066CC;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #5A7C92;
      transition: 0.2s ease;
    }

    .modal-close:hover { color: #DC3545; }

    .modal-body {
      padding: 16px 18px;
    }

    .msg {
      padding: 14px;
      border-radius: 12px;
      border: 1px solid #E0E6ED;
      display: flex;
      gap: 12px;
      align-items: flex-start;
      line-height: 1.35;
      background: #F8F9FA;
      color: #2C5282;
    }

    .msg.success {
      border-color: rgba(25, 135, 84, 0.35);
      background: rgba(25, 135, 84, 0.08);
    }

    .msg.error {
      border-color: rgba(220, 53, 69, 0.35);
      background: rgba(220, 53, 69, 0.08);
    }

    .msg.info {
      border-color: rgba(13, 110, 253, 0.35);
      background: rgba(13, 110, 253, 0.08);
    }

    .msg-icon {
      font-size: 1.35rem;
      margin-top: 2px;
      line-height: 1;
    }

    .modal-foot {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 14px 18px;
      border-top: 2px solid #E0E6ED;
      flex-wrap: wrap;
    }

    .btn {
      padding: 10px 16px;
      border-radius: 12px;
      font-weight: 800;
      cursor: pointer;
      border: none;
      transition: all 0.25s ease;
    }

    .btn.secondary {
      background: #F3F5F7;
      color: #5A7C92;
      border: 2px solid #E0E6ED;
    }

    .btn.secondary:hover { background: #E9ECEF; }

    .btn.primary {
      background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
      color: white;
    }

    .btn.primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 18px rgba(0, 102, 204, 0.22);
    }

    .btn.danger {
      background: #DC3545;
      color: white;
    }

    .btn.danger:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 18px rgba(220, 53, 69, 0.2);
    }

    .btn:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    /* ===== Responsive ===== */
    @media (max-width: 992px) {
      .bar {
        grid-template-columns: auto 1fr auto;
      }

      .center {
        justify-content: flex-start;
      }

      .subtitle {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .bar {
        grid-template-columns: auto 1fr auto;
        padding: 0.75rem 0.9rem;
      }

      .user-details {
        display: none;
      }

      .brand {
        font-size: 1.15rem;
      }

      .user {
        padding: 6px;
      }
    }
  `;

  static properties = {
    currentUser: { type: Object },

    // sidebar
    sidebarCollapsed: { type: Boolean },

    // message modal
    showMsgModal: { type: Boolean },
    msgType: { type: String },
    msgTitle: { type: String },
    msgText: { type: String },

    // confirm modal
    showConfirmModal: { type: Boolean },
    confirmTitle: { type: String },
    confirmText: { type: String },
    confirming: { type: Boolean }
  };

  constructor() {
    super();
    this.currentUser = authService.getCurrentUser();

    this.sidebarCollapsed = false;

    this.showMsgModal = false;
    this.msgType = 'info';
    this.msgTitle = '';
    this.msgText = '';

    this.showConfirmModal = false;
    this.confirmTitle = '';
    this.confirmText = '';
    this.confirming = false;
  }

  /* ===== Reemplazo de alert() ===== */
  showMessage(type, title, text) {
    this.msgType = type;
    this.msgTitle = title;
    this.msgText = text;
    this.showMsgModal = true;
  }

  closeMessage() {
    this.showMsgModal = false;
    this.msgType = 'info';
    this.msgTitle = '';
    this.msgText = '';
  }

  /* ===== Reemplazo de confirm() ===== */
  openConfirm(title, text) {
    this.confirmTitle = title;
    this.confirmText = text;
    this.showConfirmModal = true;
    this.confirming = false;
  }

  closeConfirm() {
    this.showConfirmModal = false;
    this.confirmTitle = '';
    this.confirmText = '';
    this.confirming = false;
  }

  handleLogout() {
    this.openConfirm('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?');
  }

  confirmLogout() {
    this.confirming = true;

    // logout real
    authService.logout();
    window.dispatchEvent(new CustomEvent('auth-changed'));

    this.closeConfirm();
    this.showMessage('success', 'Sesión cerrada', 'Sesión cerrada exitosamente');
    this.confirming = false;
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    window.dispatchEvent(new CustomEvent('sidebar-toggle', {
      detail: { collapsed: this.sidebarCollapsed }
    }));
  }

  getRoleText(rol) {
    switch (rol) {
      case 'ADMIN': return 'Administrador';
      case 'MEDICO': return 'Médico';
      case 'PACIENTE': return 'Paciente';
      default: return rol || 'Usuario';
    }
  }

  getRoleClass(rol) {
    switch (rol) {
      case 'ADMIN': return 'role-admin';
      case 'MEDICO': return 'role-medico';
      case 'PACIENTE': return 'role-paciente';
      default: return '';
    }
  }

  getInitials(name) {
    if (!name) return '?';
    const names = String(name).trim().split(' ').filter(Boolean);
    if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
    return String(name).substring(0, 2).toUpperCase();
  }

  renderMessageModal() {
    if (!this.showMsgModal) return '';

    const icon =
      this.msgType === 'success' ? 'bi-check-circle-fill' :
      this.msgType === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill';

    const klass = this.msgType === 'success' ? 'msg success' :
                  this.msgType === 'error' ? 'msg error' : 'msg info';

    return html`
      <div class="modal-overlay" @click=${this.closeMessage}>
        <div class="modal-content" @click=${(e) => e.stopPropagation()}>
          <div class="modal-head">
            <h3 class="modal-title">${this.msgTitle || 'Mensaje'}</h3>
            <button class="modal-close" @click=${this.closeMessage}>
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class=${klass}>
              <i class="bi ${icon} msg-icon"></i>
              <div>${this.msgText}</div>
            </div>
          </div>

          <div class="modal-foot">
            <button class="btn primary" @click=${this.closeMessage}>Aceptar</button>
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
          <div class="modal-head">
            <h3 class="modal-title">${this.confirmTitle || 'Confirmación'}</h3>
            <button class="modal-close" @click=${this.closeConfirm}>
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class="msg info">
              <i class="bi bi-question-circle-fill msg-icon"></i>
              <div>${this.confirmText}</div>
            </div>
          </div>

          <div class="modal-foot">
            <button class="btn secondary" @click=${this.closeConfirm}>Cancelar</button>
            <button class="btn danger" ?disabled=${this.confirming} @click=${this.confirmLogout}>
              ${this.confirming ? 'Saliendo...' : 'Cerrar sesión'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <header class="header">
        <div class="bar">
          <div class="left">
            <button class="sidebar-toggle" @click=${this.toggleSidebar} title="Menú">
              <i class="bi bi-list"></i>
            </button>

            <a class="brand" href="#">
              <i class="bi bi-hospital"></i>
              <span>Sistema Clínico</span>
              <span class="subtitle">Panel</span>
            </a>
          </div>

          <div class="center"></div>

          <div class="right">
            <div class="user" title="${this.currentUser?.nombre || 'Usuario'}">
              <div class="user-avatar">
                ${this.getInitials(this.currentUser?.nombre)}
              </div>
              <div class="user-details">
                <div class="user-name">${this.currentUser?.nombre || 'Usuario'}</div>
                <span class="role-badge ${this.getRoleClass(this.currentUser?.rol)}">
                  ${this.getRoleText(this.currentUser?.rol)}
                </span>
              </div>
            </div>

            <button class="btn-logout" @click=${this.handleLogout} title="Cerrar sesión">
              <i class="bi bi-box-arrow-right"></i>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      ${this.renderConfirmModal()}
      ${this.renderMessageModal()}
    `;
  }
}

customElements.define('app-header', AppHeader);
