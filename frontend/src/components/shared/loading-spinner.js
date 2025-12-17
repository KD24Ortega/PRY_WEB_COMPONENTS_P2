import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

class LoadingSpinner extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .spinner-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px;
        }

        .spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(0, 102, 204, 0.1);
            border-top-color: #0066CC;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .spinner-text {
            margin-top: 20px;
            color: #5A7C92;
            font-size: 1rem;
        }
    `;

    static properties = {
        text: { type: String }
    };

    constructor() {
        super();
        this.text = 'Cargando...';
    }

    render() {
        return html`
            <div class="spinner-container">
                <div class="spinner"></div>
                <div class="spinner-text">${this.text}</div>
            </div>
        `;
    }
}

customElements.define('loading-spinner', LoadingSpinner);