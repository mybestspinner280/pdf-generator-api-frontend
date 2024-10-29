export class CsvModel {
    constructor() {
        this.data = [];
        this.headers = [];
    }

    setData(data) {
        this.data = data;
        if (data.length > 0) {
            this.headers = Object.keys(data[0]);
        }
    }

    getData() {
        return this.data;
    }

    getHeaders() {
        return this.headers;
    }

    getPreviewData(rows = 5) {
        return this.data.slice(0, rows);
    }

    getTotalRows() {
        return this.data.length;
    }
}