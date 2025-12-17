import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import apiService from '../../services/api.service.js';
import '../shared/data-table.js';
import '../shared/loading-spinner.js';

class PacientesManager extends LitElement {
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

        .btn-add {
            padding: 12px 24px;
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-add:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 102, 204, 0.3);
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
            max-width: 700px;
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

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        label {
            display: block;
            font-weight: 600;
            color: #2C5282;
            margin-bottom: 8px;
            font-size: 0.95rem;
        }

        input, select {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #E0E6ED;
            border-radius: 8px;
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }

        input:focus, select:focus {
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
    `;

    static properties = {
        pacientes: { type: Array },
        loading: { type: Boolean },
        showModal: { type: Boolean },
        editingPaciente: { type: Object },
        saving: { type: Boolean }
    };

    constructor() {
        super();
        this.pacientes = [];
        this.loading = true;
        this.showModal = false;
        this.editingPaciente = null;
        this.saving = false;
        this.loadPacientes();
    }

    async loadPacientes() {
        try {
            this.pacientes = await apiService.getPacientes();
        } catch (error) {
            console.error('Error al cargar pacientes:', error);
            this.showNotification('Error al cargar pacientes', 'error');
        } finally {
            this.loading = false;
        }
    }

    openCreateModal() {
        this.editingPaciente = null;
        this.showModal = true;
    }

    openEditModal(e) {
        this.editingPaciente = e.detail.item;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.editingPaciente = null;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const data = {
            nombre: form.nombre.value,
            cedula: form.cedula.value,
            edad: parseInt(form.edad.value) || 0,
            genero: form.genero.value,
            estatura: parseInt(form.estatura.value) || 0,
            peso: parseFloat(form.peso.value) || 0,
            foto: form.foto.value || 'default.jpg'
        };

        this.saving = true;

        try {
            if (this.editingPaciente) {
                await apiService.updatePaciente(this.editingPaciente.IdPaciente, data);
                this.showNotification('Paciente actualizado exitosamente', 'success');
            } else {
                await apiService.createPaciente(data);
                this.showNotification('Paciente creado exitosamente', 'success');
            }

            this.closeModal();
            this.loadPacientes();
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al guardar paciente', 'error');
        } finally {
            this.saving = false;
        }
    }

    async handleDelete(e) {
        const paciente = e.detail.item;
        
        if (confirm(`¿Estás seguro de eliminar al paciente "${paciente.Nombre}"?`)) {
            try {
                await apiService.deletePaciente(paciente.IdPaciente);
                this.showNotification('Paciente eliminado exitosamente', 'success');
                this.loadPacientes();
            } catch (error) {
                console.error('Error:', error);
                this.showNotification('Error al eliminar paciente', 'error');
            }
        }
    }

    showNotification(message, type) {
        alert(message);
    }

    renderModal() {
        if (!this.showModal) return '';

        const paciente = this.editingPaciente;

        return html`
            <div class="modal-overlay" @click=${this.closeModal}>
                <div class="modal-content" @click=${(e) => e.stopPropagation()}>
                    <div class="modal-header">
                        <h3 class="modal-title">
                            ${paciente ? 'Editar Paciente' : 'Nuevo Paciente'}
                        </h3>
                        <button class="btn-close" @click=${this.closeModal}>
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <form @submit=${this.handleSubmit}>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Nombre Completo *</label>
                                <input 
                                    type="text" 
                                    name="nombre" 
                                    .value=${paciente?.Nombre || ''}
                                    placeholder="Juan Pérez"
                                    required>
                            </div>

                            <div class="form-group">
                                <label>Cédula *</label>
                                <input 
                                    type="text" 
                                    name="cedula" 
                                    .value=${paciente?.Cedula || ''}
                                    placeholder="1234567890"
                                    required>
                            </div>

                            <div class="form-group">
                                <label>Edad</label>
                                <input 
                                    type="number" 
                                    name="edad" 
                                    .value=${paciente?.Edad || ''}
                                    min="0" 
                                    max="150"
                                    placeholder="30">
                            </div>

                            <div class="form-group">
                                <label>Género</label>
                                <select name="genero">
                                    <option value="Masculino" ?selected=${paciente?.Genero === 'Masculino'}>Masculino</option>
                                    <option value="Femenino" ?selected=${paciente?.Genero === 'Femenino'}>Femenino</option>
                                    <option value="Otro" ?selected=${paciente?.Genero === 'Otro'}>Otro</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Estatura (cm)</label>
                                <input 
                                    type="number" 
                                    name="estatura" 
                                    .value=${paciente?.Estatura || ''}
                                    min="0" 
                                    max="300"
                                    placeholder="170">
                            </div>

                            <div class="form-group">
                                <label>Peso (kg)</label>
                                <input 
                                    type="number" 
                                    name="peso" 
                                    .value=${paciente?.Peso || ''}
                                    min="0" 
                                    max="500"
                                    step="0.1"
                                    placeholder="70">
                            </div>

                            <div class="form-group full-width">
                                <label>Foto (URL o nombre de archivo)</label>
                                <input 
                                    type="text" 
                                    name="foto" 
                                    .value=${paciente?.Foto || ''}
                                    placeholder="default.jpg">
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn-cancel" @click=${this.closeModal}>
                                Cancelar
                            </button>
                            <button type="submit" class="btn-save" ?disabled=${this.saving}>
                                ${this.saving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    render() {
        if (this.loading) {
            return html`<loading-spinner text="Cargando pacientes..."></loading-spinner>`;
        }

        const columns = [
            { header: 'ID', field: 'IdPaciente' },
            { header: 'Nombre', field: 'Nombre' },
            { header: 'Cédula', field: 'Cedula' },
            { header: 'Edad', field: 'Edad' },
            { header: 'Género', field: 'Genero' },
            { 
                header: 'IMC', 
                field: 'Peso',
                render: (peso, item) => {
                    if (item.Estatura > 0) {
                        const imc = peso / Math.pow(item.Estatura / 100, 2);
                        return imc.toFixed(2);
                    }
                    return 'N/A';
                }
            }
        ];

        return html`
            <div class="page-header">
                <h1 class="page-title">
                    <i class="bi bi-people"></i>
                    Pacientes
                </h1>
                <button class="btn-add" @click=${this.openCreateModal}>
                    <i class="bi bi-plus-circle"></i>
                    Nuevo Paciente
                </button>
            </div>

            <data-table
                title="Listado de Pacientes"
                .columns=${columns}
                .data=${this.pacientes}
                @edit=${this.openEditModal}
                @delete=${this.handleDelete}>
            </data-table>

            ${this.renderModal()}
        `;
    }
}

customElements.define('pacientes-manager', PacientesManager);