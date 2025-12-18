import { LitElement, html, css } from 'lit';
import apiService from '../../services/api.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';
import '../shared/image-upload.js';

class UsuariosManager extends LitElement {
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

        .filters {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 20px;
        }

        .filter-btn {
            padding: 8px 16px;
            background: white;
            color: #5A7C92;
            border: 2px solid #E0E6ED;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .filter-btn:hover {
            border-color: #0066CC;
            color: #0066CC;
        }

        .filter-btn.active {
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
            border-color: #0066CC;
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
            max-width: 500px;
            width: 100%;
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

        .btn-cancel:hover {
            background: #E9ECEF;
        }

        .btn-save, .btn-confirm {
            padding: 10px 20px;
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-save:hover, .btn-confirm:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        }

        .btn-save:disabled {
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

        .role-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .role-admin {
            background: rgba(255, 193, 7, 0.2);
            color: #FFA000;
        }

        .role-medico {
            background: rgba(0, 229, 160, 0.2);
            color: #00B377;
        }

        .role-paciente {
            background: rgba(0, 102, 204, 0.2);
            color: #0066CC;
        }

        .user-info {
            background: #F8F9FA;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 0.9rem;
        }

        .info-row:last-child {
            margin-bottom: 0;
        }

        .info-label {
            font-weight: 600;
            color: #5A7C92;
        }

        .info-value {
            color: #2C5282;
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

        .detail-grid {
            display: grid;
            gap: 15px;
        }

        .detail-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
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
        }

        .warning-text {
            margin-bottom: 15px;
            color: #2C5282;
            line-height: 1.5;
        }

        .danger-text {
            margin-bottom: 0;
            color: #DC3545;
            font-size: 0.9rem;
        }

        .photo-section {
            margin-bottom: 20px;
            padding: 20px;
            background: #F8F9FA;
            border-radius: 12px;
        }

        .section-title {
            font-size: 1rem;
            font-weight: 600;
            color: #2C5282;
            margin-bottom: 15px;
            text-align: center;
        }

        .user-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #0066CC;
        }

        .avatar-container {
            text-align: center;
            margin-bottom: 10px;
        }
    `;

    static properties = {
        usuarios: { type: Array },
        filteredUsuarios: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        modalType: { type: String },
        selectedUsuario: { type: Object },
        saving: { type: Boolean },
        roleFilter: { type: String },
        notification: { type: Object },
        selectedPhoto: { type: String }
    };

    constructor() {
        super();
        this.usuarios = [];
        this.filteredUsuarios = [];
        this.loading = true;
        this.showModal = false;
        this.modalType = '';
        this.selectedUsuario = null;
        this.saving = false;
        this.roleFilter = 'ALL';
        this.notification = null;
        this.selectedPhoto = '';
        this.loadUsuarios();
    }

    async loadUsuarios() {
        try {
            this.usuarios = await apiService.getUsuarios();
            this.applyFilter();
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            this.showNotification('Error al cargar usuarios', 'error');
        } finally {
            this.loading = false;
        }
    }

    applyFilter() {
        if (this.roleFilter === 'ALL') {
            this.filteredUsuarios = this.usuarios;
        } else {
            this.filteredUsuarios = this.usuarios.filter(u => u.rol === this.roleFilter);
        }
    }

    setRoleFilter(role) {
        this.roleFilter = role;
        this.applyFilter();
    }

    openViewModal(e) {
        this.selectedUsuario = e.detail.item;
        this.modalType = 'view';
        this.showModal = true;
    }

    openEditPhotoModal(e) {
        this.selectedUsuario = e.detail.item;
        this.selectedPhoto = this.selectedUsuario.foto || '';
        this.modalType = 'edit-photo';
        this.showModal = true;
    }

    openResetPasswordModal(e) {
        this.selectedUsuario = e.detail.item;
        this.modalType = 'reset-password';
        this.showModal = true;
    }

    openDeleteModal(e) {
        this.selectedUsuario = e.detail.item;
        this.modalType = 'delete';
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.modalType = '';
        this.selectedUsuario = null;
        this.selectedPhoto = '';
    }

    // Cambiar nombre del evento
    handleFileSelected(e) {
        this.selectedFile = e.detail.file;
    }

    handleFileRemoved() {
        this.selectedFile = null;
    }

    async handleSavePhoto(e) {
        e.preventDefault();

        if (!this.selectedFile) {
            this.showNotification('Por favor selecciona una foto', 'error');
            return;
        }

        this.saving = true;

        try {
            await apiService.updateUserPhoto(this.selectedUsuario.idUsuario, this.selectedFile);
            this.showNotification('Foto actualizada exitosamente', 'success');
            this.closeModal();
            this.loadUsuarios();
        } catch (error) {
            console.error('Error:', error);
            this.showNotification(error.message || 'Error al guardar foto', 'error');
        } finally {
            this.saving = false;
        }
    }

    async handleResetPassword(e) {
        e.preventDefault();
        
        const form = e.target;
        const newPassword = form.newPassword.value;

        this.saving = true;

        try {
            await apiService.resetPassword(this.selectedUsuario.idUsuario, newPassword);
            this.showNotification('Contraseña restablecida exitosamente', 'success');
            this.closeModal();
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al restablecer contraseña', 'error');
        } finally {
            this.saving = false;
        }
    }

    async handleDeleteConfirm() {
        const usuario = this.selectedUsuario;
        
        if (usuario.usuario === 'admin') {
            this.showNotification('No se puede eliminar el administrador principal', 'error');
            this.closeModal();
            return;
        }

        this.saving = true;

        try {
            await apiService.deleteUsuario(usuario.idUsuario);
            this.showNotification('Usuario eliminado exitosamente', 'success');
            this.closeModal();
            this.loadUsuarios();
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al eliminar usuario', 'error');
        } finally {
            this.saving = false;
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

    renderModal() {
        if (!this.showModal) return '';

        if (this.modalType === 'view') {
            // Construir URL completa de la foto
            const fotoUrl = this.selectedUsuario?.foto && 
                        this.selectedUsuario.foto !== 'default.jpg' && 
                        this.selectedUsuario.foto !== '/uploads/avatars/default.jpg'
                ? `http://localhost:3000${this.selectedUsuario.foto}` 
                : null;

            return html`
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
                
                <div class="modal-overlay" @click=${this.closeModal}>
                    <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                        <div class="modal-header">
                            <h3 class="modal-title">
                                <i class="bi bi-person-circle"></i>
                                Detalles del Usuario
                            </h3>
                            <button class="btn-close" @click=${this.closeModal}>
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>

                        ${fotoUrl ? html`
                            <div class="avatar-container">
                                <img src="${fotoUrl}" alt="Avatar" class="user-avatar" @error=${this.handleImageError}>
                            </div>
                        ` : html`
                            <div class="avatar-container">
                                <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%); display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                                    <i class="bi bi-person" style="font-size: 3rem; color: white;"></i>
                                </div>
                            </div>
                        `}

                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="detail-label">Usuario</span>
                                <span class="detail-value">${this.selectedUsuario?.usuario}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Nombre</span>
                                <span class="detail-value">${this.selectedUsuario?.nombre}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Rol</span>
                                <span class="detail-value">
                                    <span class="role-badge role-${this.selectedUsuario?.rol?.toLowerCase()}">
                                        ${this.selectedUsuario?.rol}
                                    </span>
                                </span>
                            </div>
                            ${fotoUrl ? html`
                                <div class="detail-item">
                                    <span class="detail-label">Foto</span>
                                    <span class="detail-value" style="font-size: 0.8rem; overflow-wrap: break-word;">${this.selectedUsuario?.foto}</span>
                                </div>
                            ` : ''}
                        </div>

                        <div class="modal-footer">
                            <button class="btn-cancel" @click=${this.closeModal}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        if (this.modalType === 'edit-photo') {
            return html`
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
        
                <div class="modal-overlay" @click=${this.closeModal}>
                    <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                        <div class="modal-header">
                            <h3 class="modal-title">
                                <i class="bi bi-camera"></i>
                                Cambiar Foto de Perfil
                            </h3>
                            <button class="btn-close" @click=${this.closeModal}>
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div class="user-info">
                            <div class="info-row">
                                <span class="info-label">Usuario:</span>
                                <span class="info-value">${this.selectedUsuario?.usuario}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Nombre:</span>
                                <span class="info-value">${this.selectedUsuario?.nombre}</span>
                            </div>
                        </div>

                        <div class="photo-section">
                            <div class="section-title">Foto de Perfil</div>
                            <image-upload
                                .imageUrl=${this.selectedPhoto}
                                @file-selected=${this.handleFileSelected}
                                @file-removed=${this.handleFileRemoved}>
                            </image-upload>
                        </div>

                        <div class="modal-footer">
                            <button class="btn-cancel" @click=${this.closeModal}>
                                Cancelar
                            </button>
                            <button class="btn-save" @click=${this.handleSavePhoto} ?disabled=${this.saving}>
                                ${this.saving ? 'Guardando...' : 'Guardar Foto'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        if (this.modalType === 'reset-password') {
            return html`
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
        
                <div class="modal-overlay" @click=${this.closeModal}>
                    <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                        <div class="modal-header">
                            <h3 class="modal-title">
                                <i class="bi bi-key"></i>
                                Restablecer Contraseña
                            </h3>
                            <button class="btn-close" @click=${this.closeModal}>
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div class="user-info">
                            <div class="info-row">
                                <span class="info-label">Usuario:</span>
                                <span class="info-value">${this.selectedUsuario?.usuario}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Nombre:</span>
                                <span class="info-value">${this.selectedUsuario?.nombre}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Rol:</span>
                                <span class="role-badge role-${this.selectedUsuario?.rol?.toLowerCase()}">
                                    ${this.selectedUsuario?.rol}
                                </span>
                            </div>
                        </div>

                        <form @submit=${this.handleResetPassword}>
                            <div class="form-group">
                                <label>Nueva Contraseña *</label>
                                <input 
                                    type="password" 
                                    name="newPassword" 
                                    placeholder="Ingresa la nueva contraseña"
                                    minlength="3"
                                    required>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn-cancel" @click=${this.closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" class="btn-save" ?disabled=${this.saving}>
                                    ${this.saving ? 'Restableciendo...' : 'Restablecer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        }

        if (this.modalType === 'delete') {
            return html`
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
        
                <div class="modal-overlay" @click=${this.closeModal}>
                    <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                        <div class="modal-header">
                            <h3 class="modal-title">
                                <i class="bi bi-exclamation-triangle"></i>
                                Confirmar Eliminación
                            </h3>
                            <button class="btn-close" @click=${this.closeModal}>
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div class="user-info">
                            <p class="warning-text">
                                ¿Estás seguro de eliminar al usuario <strong>"${this.selectedUsuario?.usuario}"</strong>?
                            </p>
                            <p class="danger-text">
                                <i class="bi bi-exclamation-circle"></i>
                                Esta acción eliminará también su registro asociado y no se puede deshacer.
                            </p>
                        </div>

                        <div class="modal-footer">
                            <button class="btn-cancel" @click=${this.closeModal}>
                                Cancelar
                            </button>
                            <button class="btn-confirm btn-danger" @click=${this.handleDeleteConfirm} ?disabled=${this.saving}>
                                ${this.saving ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        return '';
    }

    handleImageError(e) {
        console.error('Error al cargar imagen:', e.target.src);
        e.target.style.display = 'none';
    }

    render() {
        if (this.loading) {
            return html`
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
                <loading-spinner text="Cargando usuarios..."></loading-spinner>
            `;
        }

        const columns = [
            { header: 'Usuario', field: 'usuario' },
            { header: 'Nombre', field: 'nombre' },
            { 
                header: 'Rol', 
                field: 'rol',
                render: (rol) => html`
                    <span class="role-badge role-${rol.toLowerCase()}">
                        ${rol}
                    </span>
                `
            }
        ];

        return html`
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
            <div class="page-header">
                <h1 class="page-title">
                    <i class="bi bi-person-gear"></i>
                    Gestión de Usuarios
                </h1>
            </div>

            <div class="filters">
                <button 
                    class="filter-btn ${this.roleFilter === 'ALL' ? 'active' : ''}"
                    @click=${() => this.setRoleFilter('ALL')}>
                    Todos (${this.usuarios.length})
                </button>
                <button 
                    class="filter-btn ${this.roleFilter === 'ADMIN' ? 'active' : ''}"
                    @click=${() => this.setRoleFilter('ADMIN')}>
                    Administradores
                </button>
                <button 
                    class="filter-btn ${this.roleFilter === 'MEDICO' ? 'active' : ''}"
                    @click=${() => this.setRoleFilter('MEDICO')}>
                    Médicos
                </button>
                <button 
                    class="filter-btn ${this.roleFilter === 'PACIENTE' ? 'active' : ''}"
                    @click=${() => this.setRoleFilter('PACIENTE')}>
                    Pacientes
                </button>
            </div>

            <data-table
                title="Listado de Usuarios del Sistema"
                .columns=${columns}
                .data=${this.filteredUsuarios}
                @view=${this.openViewModal}
                @edit=${this.openEditPhotoModal}
                @delete=${this.openDeleteModal}>
            </data-table>

            ${this.renderModal()}
            ${this.renderNotification()}
        `;
    }
}

customElements.define('usuarios-manager', UsuariosManager);