import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import apiService from '../../services/api.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class UsuariosManager extends LitElement {
    static styles = css`
        :host {
            display: block;
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
        }

        .modal-content {
            background: white;
            border-radius: 16px;
            padding: 30px;
            max-width: 500px;
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

        .role-badge {
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
            margin-bottom: 8px;
            font-size: 0.9rem;
        }

        .info-label {
            font-weight: 600;
            color: #5A7C92;
        }

        .info-value {
            color: #2C5282;
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
        roleFilter: { type: String }
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

    openResetPasswordModal(e) {
        this.selectedUsuario = e.detail.item;
        this.modalType = 'reset-password';
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.modalType = '';
        this.selectedUsuario = null;
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

    async handleDelete(e) {
        const usuario = e.detail.item;
        
        if (usuario.usuario === 'admin') {
            this.showNotification('No se puede eliminar el administrador principal', 'error');
            return;
        }

        if (confirm(`¿Estás seguro de eliminar al usuario "${usuario.usuario}"? Esta acción eliminará también su registro asociado.`)) {
            try {
                await apiService.deleteUsuario(usuario.idUsuario);
                this.showNotification('Usuario eliminado exitosamente', 'success');
                this.loadUsuarios();
            } catch (error) {
                console.error('Error:', error);
                this.showNotification('Error al eliminar usuario', 'error');
            }
        }
    }

    showNotification(message, type) {
        alert(message);
    }

    renderModal() {
        if (!this.showModal) return '';

        if (this.modalType === 'reset-password') {
            return html`
                <div class="modal-overlay" @click=${this.closeModal}>
                    <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                        <div class="modal-header">
                            <h3 class="modal-title">
                                <i class="bi bi-key me-2"></i>
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

        return '';
    }

    render() {
        if (this.loading) {
            return html`<loading-spinner text="Cargando usuarios..."></loading-spinner>`;
        }

        const columns = [
            { header: 'ID', field: 'idUsuario' },
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
                @view=${this.openResetPasswordModal}
                @delete=${this.handleDelete}>
            </data-table>

            ${this.renderModal()}
        `;
    }
}

customElements.define('usuarios-manager', UsuariosManager);