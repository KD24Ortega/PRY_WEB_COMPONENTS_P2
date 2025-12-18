import { LitElement, html, css } from 'lit';

class AppFooter extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .footer {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-top: 2px solid #E0E6ED;
            margin-top: auto;
        }

        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
            max-width: 1400px;
            margin: 0 auto;
        }

        .copyright {
            color: #5A7C92;
            font-size: 0.9rem;
        }

        .footer-links {
            display: flex;
            gap: 20px;
        }

        .footer-link {
            color: #0066CC;
            text-decoration: none;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .footer-link:hover {
            color: #004080;
            text-decoration: underline;
        }

        .version {
            color: #95A5A6;
            font-size: 0.85rem;
            font-weight: 500;
        }

        @media (max-width: 768px) {
            .footer-content {
                flex-direction: column;
                text-align: center;
            }
        }
    `;

    render() {
        const currentYear = new Date().getFullYear();

        return html`
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
            <footer class="footer">
                <div class="footer-content">
                    <div class="copyright">
                        © ${currentYear} Sistema Clínico. Todos los derechos reservados.
                    </div>
                    <div class="version">
                        <i class="bi bi-code-square me-1"></i>
                        Versión 1.0.0
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('app-footer', AppFooter);