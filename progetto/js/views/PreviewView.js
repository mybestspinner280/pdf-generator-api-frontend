export class PreviewView {
    constructor() {
        this.previewSection = document.getElementById('previewSection');
        this.tableContainer = document.getElementById('tableContainer');
        this.generateButton = document.getElementById('generateButton');
    }

    showPreview(data, headers, totalRows) {
        this.previewSection.classList.remove('hidden');
        this.tableContainer.innerHTML = '';

        const table = this.createTable(data, headers);
        this.tableContainer.appendChild(table);

        if (totalRows > data.length) {
            this.addRowCountMessage(totalRows, data.length);
        }
    }

    createTable(data, headers) {
        const table = document.createElement('table');
        
        // Create header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = this.formatHeaderText(header);
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create body
        const tbody = document.createElement('tbody');
        data.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header];
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        return table;
    }

    formatHeaderText(header) {
        return header
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    addRowCountMessage(total, shown) {
        const message = document.createElement('p');
        message.textContent = `... e altri ${total - shown} record`;
        message.className = 'additional-rows-message';
        this.tableContainer.appendChild(message);
    }

    setGenerateCallback(callback) {
        this.generateButton.addEventListener('click', callback);
    }

    enableGenerateButton() {
        this.generateButton.disabled = false;
    }

    disableGenerateButton() {
        this.generateButton.disabled = true;
    }
}