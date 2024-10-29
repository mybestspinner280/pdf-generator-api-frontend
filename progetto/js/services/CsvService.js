export class CsvService {
    constructor() {
        this.parser = Papa;
    }

    parseFile(file) {
        return new Promise((resolve, reject) => {
            this.parser.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    resolve(results.data);
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    }

    validateData(data) {
        const requiredFields = [
            'nome', 'cognome', 'indirizzo_residenza', 'appartamento',
            'nome_condominio', 'indirizzo_condominio', 'data_prima_convocazione',
            'ora_prima_convocazione', 'data_seconda_convocazione',
            'ora_seconda_convocazione', 'luogo_assemblea', 'ordine_del_giorno',
            'luogo', 'data_convocazione', 'nome_amministratore',
            'telefono_amministratore', 'email_amministratore'
        ];

        const missingFields = requiredFields.filter(field => 
            !data[0] || !Object.keys(data[0]).includes(field)
        );

        if (missingFields.length > 0) {
            throw new Error(`Campi mancanti nel CSV: ${missingFields.join(', ')}`);
        }

        return true;
    }
}