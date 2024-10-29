export class AppController {
    constructor(csvModel, csvService, pdfService, uploadView, previewView, progressView) {
        this.csvModel = csvModel;
        this.csvService = csvService;
        this.pdfService = pdfService;
        this.uploadView = uploadView;
        this.previewView = previewView;
        this.progressView = progressView;

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.uploadView.setFileSelectedCallback(this.handleFileUpload.bind(this));
        this.previewView.setGenerateCallback(this.handleGeneratePdfs.bind(this));
    }

    async handleFileUpload(file) {
        try {
            this.progressView.showMessage('Elaborazione del file CSV...');
            const data = await this.csvService.parseFile(file);
            
            this.csvService.validateData(data);
            this.csvModel.setData(data);

            this.previewView.showPreview(
                this.csvModel.getPreviewData(),
                this.csvModel.getHeaders(),
                this.csvModel.getTotalRows()
            );

            this.progressView.hideMessage();
        } catch (error) {
            this.progressView.showError(`Errore nel caricamento del file: ${error.message}`);
        }
    }

    async handleGeneratePdfs() {
        const data = this.csvModel.getData();
        this.previewView.disableGenerateButton();
        this.progressView.showProgress();

        let successful = 0;
        let failed = 0;

        for (let i = 0; i < data.length; i++) {
            try {
                const row = data[i];
                const blob = await this.pdfService.generatePdf(row);
                const filename = `convocazione_${row.nome_condominio}_${row.nome}_${row.cognome}.pdf`;
                this.pdfService.downloadPdf(blob, filename);
                successful++;
            } catch (error) {
                failed++;
                console.error(error);
            }

            const progress = ((i + 1) / data.length) * 100;
            this.progressView.updateProgress(progress);
        }

        this.progressView.showComplete(successful, failed);
        this.previewView.enableGenerateButton();
    }
}