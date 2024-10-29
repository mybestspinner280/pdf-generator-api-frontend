export class ProgressView {
    constructor() {
        this.progressSection = document.getElementById('progressSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.statusContainer = document.getElementById('statusContainer');
        
        // Stato interno
        this.isProcessing = false;
        this.currentProgress = 0;
    }

    showProgress() {
        this.progressSection.classList.remove('hidden');
        this.isProcessing = true;
        this.currentProgress = 0;
        this.updateProgress(0);
        this.clearStatus();
    }

    hideProgress() {
        this.progressSection.classList.add('hidden');
        this.isProcessing = false;
        this.clearStatus();
    }

    updateProgress(percentage) {
        this.currentProgress = percentage;
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = `${Math.round(percentage)}% completato`;
    }

    showMessage(message, type = 'info') {
        this.clearStatus();
        
        const statusDiv = document.createElement('div');
        statusDiv.className = `status status-${type}`;
        statusDiv.textContent = message;
        
        this.statusContainer.appendChild(statusDiv);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showComplete(successful, failed) {
        const totalProcessed = successful + failed;
        let message = `Elaborazione completata! `;
        let type = 'success';

        if (failed > 0) {
            message += `${successful} PDF generati con successo, ${failed} errori.`;
            type = 'warning';
        } else {
            message += `${successful} PDF generati con successo.`;
        }

        this.showMessage(message, type);
        
        // Aggiungi dettagli se ci sono errori
        if (failed > 0) {
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'status-details';
            detailsDiv.innerHTML = `
                <div class="status-detail success">✓ Successo: ${successful}</div>
                <div class="status-detail error">✗ Errori: ${failed}</div>
            `;
            this.statusContainer.appendChild(detailsDiv);
        }
    }

    clearStatus() {
        this.statusContainer.innerHTML = '';
    }

    pulse() {
        if (!this.isProcessing) return;
        
        this.progressFill.classList.add('pulse');
        setTimeout(() => {
            this.progressFill.classList.remove('pulse');
        }, 500);
    }

    addStatusLine(message, type = 'info') {
        const lineDiv = document.createElement('div');
        lineDiv.className = `status-line status-${type}`;
        
        const timestamp = new Date().toLocaleTimeString();
        lineDiv.innerHTML = `
            <span class="status-time">${timestamp}</span>
            <span class="status-message">${message}</span>
        `;
        
        this.statusContainer.appendChild(lineDiv);
        lineDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

// Aggiungi questi stili al tuo file CSS
const styles = `
.progress-section {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 8px;
    background: #f9fafb;
}

.progress-bar {
    width: 100%;
    height: 20px;
    background: #e5e7eb;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.progress-fill {
    height: 100%;
    background: #2563eb;
    width: 0%;
    transition: width 0.3s ease;
    border-radius: 10px;
}

.progress-fill.pulse {
    animation: pulse 0.5s ease;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
}

#progressText {
    font-size: 0.875rem;
    color: #6b7280;
    text-align: center;
}

.status {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
}

.status-info {
    background: #f3f4f6;
    color: #374151;
}

.status-success {
    background: #dcfce7;
    color: #166534;
}

.status-error {
    background: #fee2e2;
    color: #991b1b;
}

.status-warning {
    background: #fef3c7;
    color: #92400e;
}

.status-details {
    margin-top: 0.5rem;
    display: flex;
    gap: 1rem;
}

.status-detail {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
}

.status-detail.success {
    background: #dcfce7;
    color: #166534;
}

.status-detail.error {
    background: #fee2e2;
    color: #991b1b;
}

.status-line {
    padding: 0.5rem;
    border-left: 3px solid #e5e7eb;
    margin: 0.25rem 0;
    font-size: 0.875rem;
}

.status-time {
    color: #6b7280;
    margin-right: 0.5rem;
    font-family: monospace;
}

.status-message {
    color: #374151;
}

.status-line.status-error {
    border-left-color: #f87171;
}

.status-line.status-success {
    border-left-color: #34d399;
}

.status-line.status-warning {
    border-left-color: #fbbf24;
}

.hidden {
    display: none;
}
`;