export class PdfModel {
    constructor() {
        this.queue = [];
        this.processedItems = [];
        this.currentIndex = 0;
        this.status = {
            successful: 0,
            failed: 0,
            total: 0
        };
        this.observers = [];
    }

    // Metodi per la gestione della coda
    addToQueue(items) {
        this.queue = [...items];
        this.status.total = items.length;
        this.notifyObservers('queueUpdated', { 
            total: this.status.total 
        });
    }

    clearQueue() {
        this.queue = [];
        this.processedItems = [];
        this.currentIndex = 0;
        this.status = {
            successful: 0,
            failed: 0,
            total: 0
        };
        this.notifyObservers('queueCleared');
    }

    getCurrentItem() {
        return this.queue[this.currentIndex];
    }

    getNextItem() {
        if (this.currentIndex < this.queue.length) {
            return this.queue[this.currentIndex++];
        }
        return null;
    }

    // Metodi per il monitoraggio del progresso
    getProgress() {
        if (this.status.total === 0) return 0;
        return (this.processedItems.length / this.status.total) * 100;
    }

    getStatus() {
        return {
            ...this.status,
            progress: this.getProgress(),
            currentIndex: this.currentIndex,
            remaining: this.status.total - this.processedItems.length
        };
    }

    // Metodi per la gestione dei risultati
    addResult(item, success, error = null) {
        const result = {
            item,
            success,
            error,
            timestamp: new Date(),
            fileName: success ? this.generateFileName(item) : null
        };

        this.processedItems.push(result);
        
        if (success) {
            this.status.successful++;
        } else {
            this.status.failed++;
        }

        this.notifyObservers('resultAdded', result);
        
        if (this.processedItems.length === this.status.total) {
            this.notifyObservers('processComplete', this.getStatus());
        }
    }

    getResults() {
        return {
            processed: this.processedItems,
            successful: this.processedItems.filter(item => item.success),
            failed: this.processedItems.filter(item => !item.success)
        };
    }

    // Metodi di utilità
    generateFileName(item) {
        const timestamp = new Date().toISOString().slice(0,10);
        const sanitizedCondominio = this.sanitizeFileName(item.nome_condominio);
        const sanitizedNome = this.sanitizeFileName(`${item.nome}_${item.cognome}`);
        return `convocazione_${sanitizedCondominio}_${sanitizedNome}_${timestamp}.pdf`;
    }

    sanitizeFileName(name) {
        return name
            .toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
    }

    // Metodi per il pattern Observer
    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers(event, data) {
        this.observers.forEach(observer => {
            if (typeof observer === 'function') {
                observer(event, data);
            } else if (typeof observer.update === 'function') {
                observer.update(event, data);
            }
        });
    }

    // Metodi per la gestione degli errori
    handleError(error, item) {
        const errorResult = {
            timestamp: new Date(),
            item,
            error: error.message || 'Errore sconosciuto'
        };

        this.addResult(item, false, errorResult);
        this.notifyObservers('error', errorResult);
    }

    // Metodi per le statistiche
    getStatistics() {
        const results = this.getResults();
        
        return {
            total: this.status.total,
            processed: this.processedItems.length,
            successful: this.status.successful,
            failed: this.status.failed,
            successRate: this.status.total > 0 
                ? (this.status.successful / this.status.total * 100).toFixed(1)
                : 0,
            averageProcessingTime: this.calculateAverageProcessingTime(),
            errorTypes: this.categorizeErrors(),
            lastProcessed: this.processedItems[this.processedItems.length - 1],
            remainingItems: this.status.total - this.processedItems.length
        };
    }

    calculateAverageProcessingTime() {
        if (this.processedItems.length < 2) return 0;
        
        const times = [];
        for (let i = 1; i < this.processedItems.length; i++) {
            const timeDiff = this.processedItems[i].timestamp - this.processedItems[i-1].timestamp;
            times.push(timeDiff);
        }
        
        return times.reduce((a, b) => a + b, 0) / times.length;
    }

    categorizeErrors() {
        const errorTypes = {};
        
        this.processedItems
            .filter(item => !item.success)
            .forEach(item => {
                const errorType = item.error?.message || 'Errore sconosciuto';
                errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;
            });
        
        return errorTypes;
    }

    // Metodi per esportazione dei risultati
    exportResults() {
        const results = this.getResults();
        const statistics = this.getStatistics();
        
        return {
            timestamp: new Date().toISOString(),
            statistics,
            successfulOperations: results.successful.map(item => ({
                condominio: item.item.nome_condominio,
                destinatario: `${item.item.nome} ${item.item.cognome}`,
                fileName: item.fileName,
                timestamp: item.timestamp
            })),
            failedOperations: results.failed.map(item => ({
                condominio: item.item.nome_condominio,
                destinatario: `${item.item.nome} ${item.item.cognome}`,
                error: item.error?.message || 'Errore sconosciuto',
                timestamp: item.timestamp
            }))
        };
    }

    // Metodi per il debug
    getDiagnostics() {
        return {
            queueSize: this.queue.length,
            processedCount: this.processedItems.length,
            currentIndex: this.currentIndex,
            status: this.status,
            observersCount: this.observers.length,
            lastProcessedTimestamp: this.processedItems[this.processedItems.length - 1]?.timestamp,
            memoryUsage: process.memoryUsage?.() || 'Not available'
        };
    }
}