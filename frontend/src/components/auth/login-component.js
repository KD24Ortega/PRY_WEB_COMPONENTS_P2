import { LitElement, html, css } from 'lit';
import authService from '../../services/auth.service.js';

class LoginComponent extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
            max-width: 450px;
        }

        .login-card {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .logo-container {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo {
            font-size: 4rem;
            margin-bottom: 10px;
        }

        h2 {
            font-family: 'Poppins', sans-serif;
            color: #0066CC;
            font-weight: 700;
            text-align: center;
            margin-bottom: 10px;
        }

        .subtitle {
            text-align: center;
            color: #5A7C92;
            margin-bottom: 30px;
            font-size: 0.95rem;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            font-weight: 600;
            color: #2C5282;
            margin-bottom: 8px;
            font-size: 0.9rem;
        }

        .input-group {
            position: relative;
        }

        .input-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #0066CC;
            font-size: 1.2rem;
        }

        input {
            width: 100%;
            padding: 14px 15px 14px 45px;
            border: 2px solid #E0E6ED;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        input:focus {
            outline: none;
            border-color: #0066CC;
            box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
        }

        .btn-login {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.05rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }

        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 102, 204, 0.3);
        }

        .btn-login:active {
            transform: translateY(0);
        }

        .btn-login:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .register-link {
            text-align: center;
            margin-top: 25px;
            color: #5A7C92;
            font-size: 0.95rem;
        }

        .register-link a {
            color: #0066CC;
            text-decoration: none;
            font-weight: 600;
            cursor: pointer;
        }

        .register-link a:hover {
            text-decoration: underline;
        }

        .alert {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 0.9rem;
        }

        .alert-danger {
            background: rgba(220, 53, 69, 0.1);
            color: #721c24;
            border: 1px solid rgba(220, 53, 69, 0.3);
        }

        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .demo-credentials {
            background: rgba(0, 102, 204, 0.05);
            border: 1px solid rgba(0, 102, 204, 0.2);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 20px;
        }

        .demo-credentials h4 {
            font-size: 0.85rem;
            color: #0066CC;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .demo-credentials p {
            font-size: 0.85rem;
            color: #5A7C92;
            margin: 5px 0;
        }

        .demo-credentials code {
            background: rgba(0, 102, 204, 0.1);
            padding: 2px 8px;
            border-radius: 4px;
            font-family: monospace;
        }
    `;

    static properties = {
        loading: { type: Boolean },
        error: { type: String }
    };

    constructor() {
        super();
        this.loading = false;
        this.error = '';
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const usuario = form.usuario.value.trim();
        const password = form.password.value;

        if (!usuario || !password) {
            this.error = 'Por favor, completa todos los campos';
            return;
        }

        this.loading = true;
        this.error = '';

        try {
            await authService.login(usuario, password);
            window.dispatchEvent(new CustomEvent('auth-changed'));
            this.showNotification('Bienvenido al sistema', 'success');
        } catch (error) {
            console.error('Error en login:', error);
            this.error = error.message || 'Credenciales incorrectas';
        } finally {
            this.loading = false;
        }
    }

    goToRegister() {
        window.dispatchEvent(new CustomEvent('navigate', {
            detail: { view: 'register' }
        }));
    }

    showNotification(message, type) {
        // Este método será implementado globalmente más adelante
        console.log(`${type}: ${message}`);
    }

    render() {
        return html`
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
            <div class="login-card">
                <div class="logo-container">
                    <div class="logo">🏥</div>
                    <h2>Iniciar Sesión</h2>
                    <p class="subtitle">Sistema Clínico</p>
                </div>

                <div class="demo-credentials">
                    <h4>👤 Credenciales de prueba:</h4>
                    <p>Usuario: <code>admin</code></p>
                    <p>Contraseña: <code>123</code></p>
                </div>

                ${this.error ? html`
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        ${this.error}
                    </div>
                ` : ''}

                <form @submit=${this.handleSubmit}>
                    <div class="form-group">
                        <label for="usuario">Usuario</label>
                        <div class="input-group">
                            <i class="input-icon bi bi-person"></i>
                            <input 
                                type="text" 
                                id="usuario" 
                                name="usuario" 
                                placeholder="Ingresa tu usuario"
                                ?disabled=${this.loading}
                                required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <div class="input-group">
                            <i class="input-icon bi bi-lock"></i>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="Ingresa tu contraseña"
                                ?disabled=${this.loading}
                                required>
                        </div>
                    </div>

                    <button type="submit" class="btn-login" ?disabled=${this.loading}>
                        ${this.loading ? html`
                            <span class="loading"></span>
                            <span class="ms-2">Ingresando...</span>
                        ` : html`
                            <i class="bi bi-box-arrow-in-right me-2"></i>
                            Ingresar
                        `}
                    </button>
                </form>

                <div class="register-link">
                    ¿No tienes cuenta? 
                    <a @click=${this.goToRegister}>Regístrate aquí</a>
                </div>
            </div>
        `;
    }
}

customElements.define('login-component', LoginComponent);