import { CsvModel } from './models/CsvModel.js';
import { CsvService } from './services/CsvService.js';
import { PdfService } from './services/PdfService.js';
import { UploadView } from './views/UploadView.js';
import { PreviewView } from './views/PreviewView.js';
import { ProgressView } from './views/ProgressView.js';
import { AppController } from './controllers/AppController.js';

// Inizializzazione dell'applicazione
document.addEventListener('DOMContentLoaded', () => {
    const csvModel = new CsvModel();
    const csvService = new CsvService();
    const pdfService = new PdfService();
    const uploadView = new UploadView();
    const previewView = new PreviewView();
    const progressView = new ProgressView();

    new AppController(
        csvModel,
        csvService,
        pdfService,
        uploadView,
        previewView,
        progressView
    );
});