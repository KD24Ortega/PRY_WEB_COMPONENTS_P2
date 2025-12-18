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

    .bar {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 16px;
      padding: 0.9rem 1.25rem;
      min-height: 68px;
    }

    .left, .right { display: flex; align-items: center; gap: 12px; }
    .left { justify-content: flex-start; }
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
    }

    .sidebar-toggle {
      background: rgba(255, 255, 255, 0.18);
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: white;
      width: 42px;
      height: 42px;
      border-radius: 10px;
      cursor: pointer;
    }

    /* ===== Avatar con Carga de Foto ===== */
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
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 800;
      color: #0066CC;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      border: 2px solid rgba(255, 255, 255, 0.5);
      transition: transform 0.2s ease;
    }

    .user-avatar:hover {
      transform: scale(1.05);
    }

    .avatar-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.2s ease;
      color: white;
      font-size: 0.8rem;
    }

    .user-avatar:hover .avatar-overlay {
      opacity: 1;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    #file-input { display: none; }

    .user-details { display: flex; flex-direction: column; min-width: 150px; }
    .user-name { font-weight: 700; font-size: 0.95rem; }

    .role-badge {
      width: fit-content;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      background: rgba(255, 255, 255, 0.2);
    }

    .btn-logout {
      background: rgba(255, 255, 255, 0.18);
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 700;
    }

    /* ===== ESTILOS MEJORADOS DEL MODAL DE CIERRE ===== */
    .modal-overlay { 
      position: fixed; 
      inset: 0; 
      background: rgba(0, 0, 0, 0.6); 
      backdrop-filter: blur(4px);
      z-index: 2000; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      animation: fadeIn 0.3s ease;
    }

    .modal-content { 
      background: white; 
      padding: 2rem; 
      border-radius: 20px; 
      text-align: center;
      max-width: 350px;
      width: 90%;
      box-shadow: 0 15px 35px rgba(0,0,0,0.2);
      animation: slideUp 0.3s ease;
    }

    .modal-content p { 
      font-size: 1.2rem; 
      font-weight: 700; 
      color: #333; 
      margin-bottom: 1.5rem;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .btn-confirm {
      background: #dc3545;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-confirm:hover { background: #bb2d3b; }

    .btn-cancel {
      background: #f8f9fa;
      color: #666;
      border: 1px solid #ddd;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
    }

    .btn-cancel:hover { background: #e2e6ea; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `;

  static properties = {
    currentUser: { type: Object },
    showConfirmModal: { type: Boolean }
  };

  constructor() {
    super();
    this.currentUser = authService.getCurrentUser();
    this.showConfirmModal = false;
  }

  triggerFileInput() {
    this.shadowRoot.getElementById('file-input').click();
  }

  async handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result;
      this.currentUser = { ...this.currentUser, foto: base64Image };
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      this.requestUpdate();
    };
    reader.readAsDataURL(file);
  }

  getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  handleLogout() { this.showConfirmModal = true; }

  confirmLogout() {
    authService.logout();
    window.dispatchEvent(new CustomEvent('auth-changed'));
    this.showConfirmModal = false;
  }

  render() {
    return html`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
      
      <header class="header">
        <div class="bar">
          <div class="left">
            <button class="sidebar-toggle"><i class="bi bi-list"></i></button>
            <a class="brand" href="#"><i class="bi bi-hospital"></i><span>Sistema Clínico</span></a>
          </div>

          <div class="right">
            <div class="user">
              <input type="file" id="file-input" accept="image/*" @change=${this.handleFileChange}>
              
              <div class="user-avatar" @click=${this.triggerFileInput} title="Cambiar foto de perfil">
                ${this.currentUser?.foto 
                  ? html`<img src="${this.currentUser.foto}" class="avatar-img">`
                  : html`<span>${this.getInitials(this.currentUser?.nombre)}</span>`
                }
                <div class="avatar-overlay">
                  <i class="bi bi-camera"></i>
                </div>
              </div>

              <div class="user-details">
                <div class="user-name">${this.currentUser?.nombre || 'Usuario'}</div>
                <div class="role-badge">${this.currentUser?.rol}</div>
              </div>
            </div>

            <button class="btn-logout" @click=${this.handleLogout}>
              <i class="bi bi-box-arrow-right"></i> Salir
            </button>
          </div>
        </div>
      </header>

      ${this.showConfirmModal ? html`
        <div class="modal-overlay">
          <div class="modal-content">
            <p>¿Estás seguro que deseas cerrar sesión?</p>
            <div class="modal-actions">
              <button class="btn-confirm" @click=${this.confirmLogout}>Sí, salir</button>
              <button class="btn-cancel" @click=${() => this.showConfirmModal = false}>Cancelar</button>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('app-header', AppHeader);