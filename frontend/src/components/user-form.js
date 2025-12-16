import { LitElement, html, css } from 'https://unpkg.com/lit@2/index.js?module';

class UserForm extends LitElement {
    static styles = css`
        form {
            background: #e3f2fd;
            padding: 25px;
            border-radius: 10px;
            margin-bottom: 30px;
            border-left: 5px solid #1976d2;
        }

        h2 {
            color: #1976d2;
            margin-bottom: 15px;
            font-size: 1.4em;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            margin-bottom: 5px;
            color: #333;
            font-weight: 500;
        }

        input, select {
            width: 100%;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #bbb;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        input:focus, select:focus {
            outline: none;
            border-color: #1976d2;
            box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
        }

        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        button {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s;
        }

        .btn-save {
            background: #1976d2;
            color: white;
        }

        .btn-save:hover {
            background: #125aa3;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .btn-cancel {
            background: #f5f5f5;
            color: #333;
        }

        .btn-cancel:hover {
            background: #e0e0e0;
        }
    `;

    static properties = {
        user: { type: Object }
    };

    constructor() {
        super();
        this.user = null;
    }

    updated(changedProperties) {
        if (changedProperties.has('user') && this.user) {
            const form = this.shadowRoot.querySelector('form');
            if (form) {
                form.nombre.value = this.user.nombre || '';
                form.correo.value = this.user.correo || '';
                form.rol.value = this.user.rol || 'Paciente';
                form.estado.value = this.user.estado || 'Activo';
            }
        }
    }

    submit(e) {
        e.preventDefault();
        const form = e.target;
        
        this.dispatchEvent(new CustomEvent('save-user', {
            detail: {
                id: this.user?.id,
                nombre: form.nombre.value.trim(),
                correo: form.correo.value.trim(),
                rol: form.rol.value,
                estado: form.estado.value
            },
            bubbles: true,
            composed: true
        }));

        form.reset();
    }

    cancel() {
        this.shadowRoot.querySelector('form').reset();
        this.dispatchEvent(new CustomEvent('cancel-edit', {
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <form @submit=${this.submit}>
                <h2>${this.user ? '✏️ Editar Usuario' : '➕ Registrar Nuevo Usuario'}</h2>

                <div class="form-group">
                    <label for="nombre">Nombre Completo *</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        name="nombre" 
                        placeholder="Ej: Dr. Juan Pérez" 
                        required
                        minlength="3">
                </div>

                <div class="form-group">
                    <label for="correo">Correo Electrónico *</label>
                    <input 
                        type="email" 
                        id="correo" 
                        name="correo" 
                        placeholder="usuario@clinica.com" 
                        required>
                </div>

                <div class="form-group">
                    <label for="rol">Rol en la Clínica *</label>
                    <select id="rol" name="rol" required>
                        <option value="Médico">Médico</option>
                        <option value="Recepcionista">Recepcionista</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Paciente">Paciente</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="estado">Estado *</label>
                    <select id="estado" name="estado" required>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>

                <div class="button-group">
                    <button type="submit" class="btn-save">
                        ${this.user ? '💾 Actualizar' : '➕ Registrar'}
                    </button>
                    ${this.user ? html`
                        <button type="button" class="btn-cancel" @click=${this.cancel}>
                            ❌ Cancelar
                        </button>
                    ` : ''}
                </div>
            </form>
        `;
    }
}

customElements.define('user-form', UserForm);