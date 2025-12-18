import { LitElement, html, css } from 'lit';

class DataTable extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .table-container {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .table-header {
            padding: 20px;
            background: linear-gradient(135deg, #0066CC 0%, #00D9FF 100%);
            color: white;
        }

        .table-title {
            font-family: 'Poppins', sans-serif;
            font-size: 1.3rem;
            font-weight: 600;
            margin: 0;
        }

        .table-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            gap: 15px;
            flex-wrap: wrap;
        }

        .search-box {
            flex: 1;
            min-width: 250px;
        }

        .search-input {
            width: 100%;
            padding: 10px 15px 10px 40px;
            border: 2px solid #E0E6ED;
            border-radius: 8px;
            font-size: 0.95rem;
        }

        .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #5A7C92;
        }

        .table-responsive {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: #F8F9FA;
        }

        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #2C5282;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
        }

        tbody tr {
            border-bottom: 1px solid #E0E6ED;
            transition: all 0.3s ease;
        }

        tbody tr:hover {
            background: rgba(0, 102, 204, 0.02);
        }

        td {
            padding: 15px;
            color: #2C5282;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #95A5A6;
        }

        .empty-icon {
            font-size: 4rem;
            margin-bottom: 15px;
        }

        .empty-text {
            font-size: 1.1rem;
            font-weight: 500;
        }

        .action-buttons {
            display: flex;
            gap: 8px;
        }

        .btn-icon {
            padding: 6px 10px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }

        .btn-edit {
            background: #FFC107;
            color: white;
        }

        .btn-edit:hover {
            background: #FFB300;
            transform: translateY(-2px);
        }

        .btn-delete {
            background: #DC3545;
            color: white;
        }

        .btn-delete:hover {
            background: #C82333;
            transform: translateY(-2px);
        }

        .btn-view {
            background: #17A2B8;
            color: white;
        }

        .btn-view:hover {
            background: #138496;
            transform: translateY(-2px);
        }
    `;

    static properties = {
        title: { type: String },
        columns: { type: Array },
        data: { type: Array },
        searchTerm: { type: String },
        showActions: { type: Boolean }
    };

    constructor() {
        super();
        this.title = 'Tabla de Datos';
        this.columns = [];
        this.data = [];
        this.searchTerm = '';
        this.showActions = true;
    }

    handleSearch(e) {
        this.searchTerm = e.target.value.toLowerCase();
        this.dispatchEvent(new CustomEvent('search', {
            detail: { searchTerm: this.searchTerm }
        }));
    }

    handleEdit(item) {
        this.dispatchEvent(new CustomEvent('edit', {
            detail: { item }
        }));
    }

    handleDelete(item) {
        this.dispatchEvent(new CustomEvent('delete', {
            detail: { item }
        }));
    }

    handleView(item) {
        this.dispatchEvent(new CustomEvent('view', {
            detail: { item }
        }));
    }

    getFilteredData() {
        if (!this.searchTerm) return this.data;

        return this.data.filter(item => {
            return this.columns.some(col => {
                const value = item[col.field];
                return value && value.toString().toLowerCase().includes(this.searchTerm);
            });
        });
    }

    render() {
        const filteredData = this.getFilteredData();

        return html`
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
       
            <div class="table-container">
                <div class="table-header">
                    <h3 class="table-title">${this.title}</h3>
                </div>

                <div class="table-actions">
                    <div class="search-box position-relative">
                        <input 
                            type="text" 
                            class="search-input"
                            placeholder="Buscar..."
                            @input=${this.handleSearch}>
                    </div>
                    <slot name="actions"></slot>
                </div>

                <div class="table-responsive">
                    ${filteredData.length === 0 ? html`
                        <div class="empty-state">
                            <div class="empty-icon">📭</div>
                            <div class="empty-text">No hay datos para mostrar</div>
                        </div>
                    ` : html`
                        <table>
                            <thead>
                                <tr>
                                    ${this.columns.map(col => html`
                                        <th>${col.header}</th>
                                    `)}
                                    ${this.showActions ? html`<th>Acciones</th>` : ''}
                                </tr>
                            </thead>
                            <tbody>
                                ${filteredData.map(item => html`
                                    <tr>
                                        ${this.columns.map(col => html`
                                            <td>${col.render ? col.render(item[col.field], item) : item[col.field]}</td>
                                        `)}
                                        ${this.showActions ? html`
                                            <td>
                                                <div class="action-buttons">
                                                    <button class="btn-icon btn-view" 
                                                            @click=${() => this.handleView(item)}
                                                            title="Ver">
                                                        <i class="bi bi-eye"></i>
                                                    </button>
                                                    <button class="btn-icon btn-edit" 
                                                            @click=${() => this.handleEdit(item)}
                                                            title="Editar">
                                                        <i class="bi bi-pencil"></i>
                                                    </button>
                                                    <button class="btn-icon btn-delete" 
                                                            @click=${() => this.handleDelete(item)}
                                                            title="Eliminar">
                                                        <i class="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        ` : ''}
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                    `}
                </div>
            </div>
        `;
    }
}

customElements.define('data-table', DataTable);