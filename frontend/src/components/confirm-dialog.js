import { LitElement, html, css } from 'https://unpkg.com/lit@2/index.js?module';

class ConfirmDialog extends LitElement {
    static styles = css`
        .overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        .dialog {
            background: white;
            padding: 30px;
            border-radius: 12px;
            width: 400px;
            max-width: 90%;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .icon {
            font-size: 3em;
            margin-bottom: 15px;
        }

        h3 {
            color: #333;
            margin-bottom: 10px;
            font-size: 1.3em;
        }

        p {
            margin-bottom: 25px;
            font-size: 1em;
            color: #666;
            line-height: 1.5;
        }

        .buttons {
            display: flex;
            gap: 10px;
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

        .btn-yes {
            background: #e53935;
            color: white;
        }

        .btn-yes:hover {
            background: #c62828;
            transform: translateY(-2px);
        }

        .btn-no {
            background: #f5f5f5;
            color: #333;
        }

        .btn-no:hover {
            background: #e0e0e0;
        }
    `;

    static properties = {
        open: { type: Boolean }
    };

    render() {
        if (!this.open) return html``;

        return html`
            <div class="overlay" @click=${this._handleOverlayClick}>
                <div class="dialog" @click=${this._stopPropagation}>
                    <div class="icon">⚠️</div>
                    <h3>Confirmar Eliminación</h3>
                    <p>
                        ¿Está seguro de que desea eliminar este usuario de la clínica?<br>
                        <strong>Esta acción no se puede deshacer.</strong>
                    </p>
                    <div class="buttons">
                        <button class="btn-no" @click=${this._cancel}>
                            ❌ Cancelar
                        </button>
                        <button class="btn-yes" @click=${this._confirm}>
                            ✔️ Sí, eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    _confirm() {
        this.dispatchEvent(new CustomEvent('confirm', {
            bubbles: true,
            composed: true
        }));
    }

    _cancel() {
        this.dispatchEvent(new CustomEvent('cancel', {
            bubbles: true,
            composed: true
        }));
    }

    _handleOverlayClick() {
        this._cancel();
    }

    _stopPropagation(e) {
        e.stopPropagation();
    }
}

customElements.define('confirm-dialog', ConfirmDialog);
