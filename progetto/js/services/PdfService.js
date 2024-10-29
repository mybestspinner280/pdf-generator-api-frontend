export class PdfService {
    constructor(apiUrl = 'http://localhost:3000/api/pdf') {
        this.apiUrl = apiUrl;
    }

    async generatePdf(data) {
        const response = await fetch(`${this.apiUrl}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                templateName: 'convocazione_assemblea',
                data: data
            })
        });

        if (!response.ok) {
            throw new Error(`Errore nella generazione del PDF: ${response.statusText}`);
        }

        const blob = await response.blob();
        return blob;
    }

    downloadPdf(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}