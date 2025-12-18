import { LitElement, html, css } from 'lit';

class ImageUpload extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    * {
      box-sizing: border-box;
    }

    .upload-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
      align-items: center;
    }

    .preview-container {
      width: 150px;
      height: 150px;
      border: 3px dashed #E0E6ED;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: #F8F9FA;
      position: relative;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .preview-container:hover {
      border-color: #0066CC;
      background: rgba(0, 102, 204, 0.05);
    }

    .preview-container.has-image {
      border-style: solid;
      border-color: #0066CC;
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder {
      text-align: center;
      color: #5A7C92;
    }

    .placeholder i {
      font-size: 3rem;
      display: block;
      margin-bottom: 8px;
      color: #0066CC;
    }

    .placeholder-text {
      font-size: 0.85rem;
    }

    input[type="file"] {
      display: none;
    }

    .upload-actions {
      display: flex;
      gap: 10px;
    }

    .btn-upload {
      padding: 8px 16px;
      background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
    }

    .btn-upload:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
    }

    .btn-remove {
      padding: 8px 16px;
      background: #F8F9FA;
      color: #DC3545;
      border: 2px solid #E0E6ED;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
    }

    .btn-remove:hover {
      background: #DC3545;
      color: white;
      border-color: #DC3545;
    }

    .error-message {
      color: #DC3545;
      font-size: 0.85rem;
      text-align: center;
    }

    .file-info {
      font-size: 0.85rem;
      color: #5A7C92;
      text-align: center;
    }

    .file-name {
      font-size: 0.85rem;
      color: #2C5282;
      text-align: center;
      font-weight: 500;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;

  static properties = {
    imageUrl: { type: String },
    selectedFile: { type: Object },
    maxSize: { type: Number },
    error: { type: String }
  };

  constructor() {
    super();
    this.imageUrl = '';
    this.selectedFile = null;
    this.maxSize = 2 * 1024 * 1024; // 2MB
    this.error = '';
  }

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      this.error = 'Solo se permiten imágenes (PNG, JPG, JPEG, GIF)';
      return;
    }

    // Validar tamaño
    if (file.size > this.maxSize) {
      this.error = `El archivo debe ser menor a ${this.maxSize / (1024 * 1024)}MB`;
      return;
    }

    this.error = '';
    this.selectedFile = file;

    // Crear preview
    const reader = new FileReader();
    reader.onload = (event) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(file);

    // Emitir evento con el archivo original
    this.dispatchEvent(new CustomEvent('file-selected', {
      detail: { file: file },
      bubbles: true,
      composed: true
    }));
  }

  triggerFileInput() {
    this.shadowRoot.querySelector('#fileInput').click();
  }

  removeImage() {
    this.imageUrl = '';
    this.selectedFile = null;
    this.error = '';
    this.shadowRoot.querySelector('#fileInput').value = '';
    
    this.dispatchEvent(new CustomEvent('file-removed', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
      
      <div class="upload-container">
        <div 
          class="preview-container ${this.imageUrl ? 'has-image' : ''}"
          @click=${this.triggerFileInput}>
          ${this.imageUrl ? html`
            <img src="${this.imageUrl}" alt="Preview" class="preview-image">
          ` : html`
            <div class="placeholder">
              <i class="bi bi-camera"></i>
              <div class="placeholder-text">Click para subir foto</div>
            </div>
          `}
        </div>

        <input
          id="fileInput"
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/gif"
          @change=${this.handleFileSelect}>

        ${this.selectedFile ? html`
          <div class="file-name" title="${this.selectedFile.name}">
            📁 ${this.selectedFile.name}
          </div>
        ` : ''}

        ${this.error ? html`
          <div class="error-message">
            <i class="bi bi-exclamation-circle"></i>
            ${this.error}
          </div>
        ` : ''}

        <div class="file-info">
          Formatos: PNG, JPG, JPEG, GIF • Máximo 2MB
        </div>

        <div class="upload-actions">
          <button class="btn-upload" @click=${this.triggerFileInput}>
            <i class="bi bi-upload"></i>
            Seleccionar
          </button>
          ${this.imageUrl ? html`
            <button class="btn-remove" @click=${this.removeImage}>
              <i class="bi bi-trash"></i>
              Quitar
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('image-upload', ImageUpload);