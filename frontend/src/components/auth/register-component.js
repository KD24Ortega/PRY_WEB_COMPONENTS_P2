import { LitElement, html, css } from 'lit';
import authService from '../../services/auth.service.js';
import apiService from '../../services/api.service.js';

class RegisterComponent extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
            max-width: 600px;
        }

        * {
            box-sizing: border-box;
        }

        .register-card {
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

        .role-selector {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }

        .role-option {
            padding: 20px;
            border: 2px solid #E0E6ED;
            border-radius: 12px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: white;
        }

        .role-option:hover {
            border-color: #0066CC;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 102, 204, 0.1);
        }

        .role-option.selected {
            border-color: #0066CC;
            background: linear-gradient(135deg, rgba(0, 102, 204, 0.05) 0%, rgba(0, 217, 255, 0.05) 100%);
        }

        .role-icon {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .role-name {
            font-weight: 600;
            color: #2C5282;
            font-size: 0.95rem;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 0;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        label {
            display: block;
            font-weight: 600;
            color: #2C5282;
            margin-bottom: 8px;
            font-size: 0.9rem;
        }

        .required {
            color: #DC3545;
        }

        input, select {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #E0E6ED;
            border-radius: 12px;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            font-family: inherit;
        }

        input:focus, select:focus {
            outline: none;
            border-color: #0066CC;
            box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
        }

        input:disabled, select:disabled {
            background: #F8F9FA;
            cursor: not-allowed;
        }

        .btn-register {
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
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-register:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 102, 204, 0.3);
        }

        .btn-register:active:not(:disabled) {
            transform: translateY(0);
        }

        .btn-register:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .login-link {
            text-align: center;
            margin-top: 25px;
            color: #5A7C92;
            font-size: 0.95rem;
        }

        .login-link a {
            color: #0066CC;
            text-decoration: none;
            font-weight: 600;
            cursor: pointer;
        }

        .login-link a:hover {
            text-decoration: underline;
        }

        .alert {
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 8px;
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

        .section-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #0066CC;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #E0E6ED;
        }

        /* Modal de éxito */
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
            z-index: 3000;
            backdrop-filter: blur(4px);
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        .modal-content {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        }

        .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            animation: scaleIn 0.5s ease;
        }

        @keyframes scaleIn {
            from {
                transform: scale(0);
            }
            to {
                transform: scale(1);
            }
        }

        .success-icon i {
            font-size: 3rem;
            color: white;
        }

        .modal-title {
            font-family: 'Poppins', sans-serif;
            font-size: 1.5rem;
            font-weight: 700;
            color: #28a745;
            margin-bottom: 10px;
        }

        .modal-text {
            color: #5A7C92;
            margin-bottom: 25px;
            line-height: 1.5;
        }

        .btn-modal {
            padding: 12px 30px;
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-modal:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        }

        .countdown {
            margin-top: 15px;
            color: #5A7C92;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .register-card {
                padding: 30px 20px;
            }

            .form-grid {
                grid-template-columns: 1fr;
            }

            .logo {
                font-size: 3rem;
            }

            h2 {
                font-size: 1.5rem;
            }
        }
    `;

    static properties = {
        selectedRole: { type: String },
        loading: { type: Boolean },
        error: { type: String },
        showSuccessModal: { type: Boolean },
        countdown: { type: Number },
        especialidades: { type: Array }
    };

    constructor() {
        super();
        this.selectedRole = '';
        this.loading = false;
        this.error = '';
        this.showSuccessModal = false;
        this.countdown = 3;
        this.especialidades = [];
        this.countdownInterval = null;
        this.loadEspecialidades();
    }

    async loadEspecialidades() {
        try {
            this.especialidades = await apiService.getEspecialidadesPublic();  
        } catch (error) {
            console.error('Error al cargar especialidades:', error);
        }
    }

    selectRole(role) {
        this.selectedRole = role;
        this.error = '';
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const usuario = form.usuario.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        if (!this.selectedRole) {
            this.error = 'Por favor, selecciona un tipo de usuario';
            return;
        }

        if (password !== confirmPassword) {
            this.error = 'Las contraseñas no coinciden';
            return;
        }

        if (password.length < 3) {
            this.error = 'La contraseña debe tener al menos 3 caracteres';
            return;
        }

        const datosPersonales = {};

        switch (this.selectedRole) {
            case 'MEDICO':
                datosPersonales.nombre = form.nombre.value.trim();
                datosPersonales.idEspecialidad = parseInt(form.especialidad.value);
                datosPersonales.foto = 'default.jpg';
                break;

            case 'PACIENTE':
                datosPersonales.nombre = form.nombre.value.trim();
                datosPersonales.cedula = form.cedula.value.trim();
                datosPersonales.edad = parseInt(form.edad.value) || 0;
                datosPersonales.genero = form.genero.value;
                datosPersonales.estatura = parseInt(form.estatura.value) || 0;
                datosPersonales.peso = parseFloat(form.peso.value) || 0;
                datosPersonales.foto = 'default.jpg';
                break;

            case 'ADMIN':
                datosPersonales.nombre = form.nombre.value.trim();
                datosPersonales.correo = form.correo.value.trim();
                break;
        }

        this.loading = true;
        this.error = '';

        try {
            await authService.register({
                usuario,
                password,
                rol: this.selectedRole,
                datosPersonales
            });

            this.showSuccessModal = true;
            this.startCountdown();
        } catch (error) {
            console.error('Error en registro:', error);
            this.error = error.message || 'Error al registrar usuario';
        } finally {
            this.loading = false;
        }
    }

    startCountdown() {
        this.countdown = 3;
        this.countdownInterval = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(this.countdownInterval);
                this.goToLogin();
            }
        }, 1000);
    }

    goToLogin() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        window.dispatchEvent(new CustomEvent('navigate', {
            detail: { view: 'login' }
        }));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }

    renderSuccessModal() {
        if (!this.showSuccessModal) return '';

        return html`
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="success-icon">
                        <i class="bi bi-check-lg"></i>
                    </div>
                    <h3 class="modal-title">¡Usuario creado correctamente!</h3>
                    <p class="modal-text">
                        Tu cuenta ha sido creada exitosamente.<br>
                        Ya puedes iniciar sesión con tus credenciales.
                    </p>
                    <button class="btn-modal" @click=${this.goToLogin}>
                        <i class="bi bi-box-arrow-in-right me-2"></i>
                        Ir al Login
                    </button>
                    <p class="countdown">
                        Redirigiendo automáticamente en ${this.countdown}s...
                    </p>
                </div>
            </div>
        `;
    }

    renderRoleSpecificFields() {
        switch (this.selectedRole) {
            case 'MEDICO':
                return html`
                    <div class="section-title">Datos del Médico</div>
                    <div class="form-grid">
                        <div class="form-group full-width">
                            <label>Nombre Completo <span class="required">*</span></label>
                            <input type="text" name="nombre" placeholder="Ingrese su nombre" required>
                        </div>
                        <div class="form-group full-width">
                            <label>Especialidad <span class="required">*</span></label>
                            <select name="especialidad" required>
                                <option value="">Selecciona una especialidad</option>
                                ${this.especialidades.map(esp => html`
                                    <option value="${esp.IdEspecialidad}">${esp.Descripcion}</option>
                                `)}
                            </select>
                        </div>
                    </div>
                `;

            case 'PACIENTE':
                return html`
                    <div class="section-title">Datos del Paciente</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Nombre Completo <span class="required">*</span></label>
                            <input type="text" name="nombre" placeholder="Ingrese su nombre" required>
                        </div>
                        <div class="form-group">
                            <label>Cédula <span class="required">*</span></label>
                            <input type="text" name="cedula" placeholder="Ingrese su cédula" required>
                        </div>
                        <div class="form-group">
                            <label>Edad</label>
                            <input type="number" name="edad" min="0" max="150" placeholder="Ingrese su edad">
                        </div>
                        <div class="form-group">
                            <label>Género</label>
                            <select name="genero">
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Estatura (cm)</label>
                            <input type="number" name="estatura" min="0" max="300" placeholder="Ingrese su estatura en cm">
                        </div>
                        <div class="form-group">
                            <label>Peso (kg)</label>
                            <input type="number" name="peso" min="0" max="500" step="0.1" placeholder="Ingrese su peso en kg">
                        </div>
                    </div>
                `;
            default:
                return '';
        }
    }

    render() {
        return html`
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
            <div class="register-card">
                <div class="logo-container">
                    <div class="logo">🏥</div>
                    <h2>Registro de Usuario</h2>
                    <p class="subtitle">Sistema Clínico</p>
                </div>

                ${this.error ? html`
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle"></i>
                        <span>${this.error}</span>
                    </div>
                ` : ''}

                <form @submit=${this.handleSubmit}>
                    <div class="section-title">Selecciona el tipo de usuario</div>
                    <div class="role-selector">
                        <div class="role-option ${this.selectedRole === 'MEDICO' ? 'selected' : ''}"
                             @click=${() => this.selectRole('MEDICO')}>
                            <div class="role-icon">👨‍⚕️</div>
                            <div class="role-name">Médico</div>
                        </div>
                        <div class="role-option ${this.selectedRole === 'PACIENTE' ? 'selected' : ''}"
                             @click=${() => this.selectRole('PACIENTE')}>
                            <div class="role-icon">🧑</div>
                            <div class="role-name">Paciente</div>
                        </div>
                    </div>

                    ${this.selectedRole ? html`
                        <div class="section-title">Credenciales de Acceso</div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Usuario <span class="required">*</span></label>
                                <input type="text" name="usuario" placeholder="Ingrese su usuario" required>
                            </div>
                            <div class="form-group">
                                <label>Contraseña <span class="required">*</span></label>
                                <input type="password" name="password" placeholder="••••••" required>
                            </div>
                            <div class="form-group full-width">
                                <label>Confirmar Contraseña <span class="required">*</span></label>
                                <input type="password" name="confirmPassword" placeholder="••••••" required>
                            </div>
                        </div>

                        ${this.renderRoleSpecificFields()}

                        <button type="submit" class="btn-register" ?disabled=${this.loading}>
                            ${this.loading ? html`
                                <span class="loading"></span>
                                <span>Registrando...</span>
                            ` : html`
                                <i class="bi bi-person-plus"></i>
                                <span>Registrarse</span>
                            `}
                        </button>
                    ` : ''}
                </form>

                <div class="login-link">
                    ¿Ya tienes cuenta? 
                    <a @click=${this.goToLogin}>Inicia sesión aquí</a>
                </div>
            </div>

            ${this.renderSuccessModal()}
        `;
    }
}

customElements.define('register-component', RegisterComponent);