import { LitElement, html, css } from 'https://unpkg.com/lit@2/index.js?module';

class UserApp extends LitElement {
    static styles = css`
        :host {
            display: block;
            max-width: 1000px;
            margin: 30px auto;
            padding: 30px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            font-family: "Segoe UI", Arial, sans-serif;
        }

        h1 {
            text-align: center;
            color: #1976d2;
            margin-bottom: 10px;
            font-size: 2em;
        }

        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
        }

        .loading {
            text-align: center;
            padding: 20px;
            color: #1976d2;
            font-size: 1.1em;
        }

        .error {
            background: #ffebee;
            color: #c62828;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 5px solid #c62828;
        }
    `;

    static properties = {
        users: { state: true },
        selectedUser: { state: true },
        userToDelete: { state: true },
        loading: { state: true },
        error: { state: true }
    };

    constructor() {
        super();
        this.users = [];
        this.selectedUser = null;
        this.userToDelete = null;
        this.loading = false;
        this.error = null;
        this.loadUsers();
    }

    async loadUsers() {
        this.loading = true;
        this.error = null;
        try {
            const response = await fetch('http://localhost:3000/users');
            if (!response.ok) throw new Error('Error al cargar usuarios');
            this.users = await response.json();
        } catch (error) {
            console.error('Error:', error);
            this.error = 'Error al conectar con el servidor. Verifica que esté activo.';
        } finally {
            this.loading = false;
        }
    }

    async saveUser(e) {
        const user = e.detail;
        const method = user.id ? 'PUT' : 'POST';
        const url = user.id 
            ? `http://localhost:3000/users/${user.id}` 
            : 'http://localhost:3000/users';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            if (!response.ok) throw new Error('Error al guardar usuario');

            const data = await response.json();
            alert(data.message);
            
            this.selectedUser = null;
            this.loadUsers();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar el usuario');
        }
    }

    editUser(e) {
        this.selectedUser = e.detail;
    }

    confirmDelete(e) {
        this.userToDelete = e.detail;
    }

    async deleteUser() {
        try {
            const response = await fetch(`http://localhost:3000/users/${this.userToDelete}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar usuario');

            const data = await response.json();
            alert(data.message);
            
            this.userToDelete = null;
            this.loadUsers();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el usuario');
        }
    }

    cancelEdit() {
        this.selectedUser = null;
    }

    render() {
        return html`
            <h1>🏥 Gestión de Usuarios</h1>
            <p class="subtitle">Sistema de Administración Clínica</p>

            ${this.error ? html`
                <div class="error">
                    ⚠️ ${this.error}
                </div>
            ` : ''}

            ${this.loading ? html`<div class="loading">⏳ Cargando usuarios...</div>` : ''}

            <user-form
                .user=${this.selectedUser}
                @save-user=${this.saveUser}
                @cancel-edit=${this.cancelEdit}>
            </user-form>

            <user-list
                .users=${this.users}
                @edit-user=${this.editUser}
                @delete-user=${this.confirmDelete}>
            </user-list>

            <confirm-dialog
                .open=${this.userToDelete !== null}
                @confirm=${this.deleteUser}
                @cancel=${() => this.userToDelete = null}>
            </confirm-dialog>
        `;
    }
}

customElements.define('user-app', UserApp);