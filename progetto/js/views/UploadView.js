export class UploadView {
    constructor() {
        this.uploadSection = document.getElementById('uploadSection');
        this.fileInput = document.getElementById('csvFile');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.uploadSection.addEventListener('click', () => this.fileInput.click());
        this.uploadSection.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadSection.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadSection.addEventListener('drop', this.handleDrop.bind(this));
        this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadSection.style.borderColor = '#2563eb';
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadSection.style.borderColor = '#ccc';
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadSection.style.borderColor = '#ccc';
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'text/csv') {
            this.onFileSelected(file);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.onFileSelected(file);
        }
    }

    onFileSelected(file) {
        // Questo metodo verrà sovrascritto dal controller
    }

    setFileSelectedCallback(callback) {
        this.onFileSelected = callback;
    }
}