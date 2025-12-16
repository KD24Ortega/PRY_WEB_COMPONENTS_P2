import { LitElement, html, css } from 'https://unpkg.com/lit@2/index.js?module';

class UserList extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        h2 {
            color: #1976d2;
            margin-bottom: 15px;
            font-size: 1.4em;
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: #999;
            background: #f9f9f9;
            border-radius: 8px;
        }

        .empty-state .icon {
            font-size: 3em;
            margin-bottom: 10px;
        }

        .empty-state p {
            font-size: 1.1em;
            margin-top: 10px;
        }
    `;

    static properties = {
        users: { type: Array }
    };

    constructor() {
        super();
        this.users = [];
    }

    render() {
        return html`
            <h2>📋 Listado de Usuarios (${this.users.length})</h2>
            
            ${this.users.length === 0 ? html`
                <div class="empty-state">
                    <div class="icon">👥</div>
                    <p><strong>No hay usuarios registrados</strong></p>
                    <p>Comienza agregando un nuevo usuario en el formulario de arriba</p>
                </div>
            ` : html`
                <ul>
                    ${this.users.map(user => html`
                        <user-item 
                            .user=${user}
                            @edit-user=${this._handleEdit}
                            @delete-user=${this._handleDelete}>
                        </user-item>
                    `)}
                </ul>
            `}
        `;
    }

    _handleEdit(e) {
        this.dispatchEvent(new CustomEvent('edit-user', {
            detail: e.detail,
            bubbles: true,
            composed: true
        }));
    }

    _handleDelete(e) {
        this.dispatchEvent(new CustomEvent('delete-user', {
            detail: e.detail,
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('user-list', UserList);