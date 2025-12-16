import { LitElement, html, css } from 'https://unpkg.com/lit@2/index.js?module';

class UserItem extends LitElement {
    static styles = css`
        li {
            background: #f9f9f9;
            border-left: 5px solid #1976d2;
            padding: 15px;
            margin-bottom: 12px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s;
        }

        li:hover {
            background: #f0f7ff;
            transform: translateX(5px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .info {
            flex: 1;
        }

        .nombre {
            font-size: 1.1em;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
        }

        .detalles {
            display: flex;
            gap: 15px;
            font-size: 0.9em;
            color: #666;
            flex-wrap: wrap;
        }

        .rol {
            font-weight: 500;
            color: #1976d2;
        }

        .estado {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: 500;
        }

        .estado-activo {
            background: #4caf50;
            color: white;
        }

        .estado-inactivo {
            background: #f44336;
            color: white;
        }

        .actions {
            display: flex;
            gap: 8px;
        }

        button {
            border: none;
            padding: 8px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.3s;
        }

        .btn-edit {
            background: #ff9800;
            color: white;
        }

        .btn-edit:hover {
            background: #f57c00;
            transform: translateY(-2px);
        }

        .btn-delete {
            background: #e53935;
            color: white;
        }

        .btn-delete:hover {
            background: #c62828;
            transform: translateY(-2px);
        }
    `;

    static properties = {
        user: { type: Object }
    };

    render() {
        const estadoClass = this.user.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo';

        return html`
            <li>
                <div class="info">
                    <div class="nombre">${this.user.nombre}</div>
                    <div class="detalles">
                        <span>📧 ${this.user.correo}</span>
                        <span class="rol">👤 ${this.user.rol}</span>
                        <span class="estado ${estadoClass}">${this.user.estado}</span>
                    </div>
                </div>
                <div class="actions">
                    <button 
                        class="btn-edit" 
                        @click=${this._edit}
                        title="Editar usuario">
                        ✏️ Editar
                    </button>
                    <button 
                        class="btn-delete" 
                        @click=${this._delete}
                        title="Eliminar usuario">
                        🗑️ Eliminar
                    </button>
                </div>
            </li>
        `;
    }

    _edit() {
        this.dispatchEvent(new CustomEvent('edit-user', {
            detail: this.user,
            bubbles: true,
            composed: true
        }));
    }

    _delete() {
        this.dispatchEvent(new CustomEvent('delete-user', {
            detail: this.user.id,
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('user-item', UserItem);