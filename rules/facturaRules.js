const { Engine } = require('json-rules-engine')


// Función de ayuda para calcular la distancia de Levenshtein
function levenshteinDistance(a, b) {
    const matrix = [];
    let i, j;

    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    // Initialize the matrix
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Populate the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1, // insertion
                    matrix[i - 1][j] + 1 // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// Crear un nuevo motor de reglas
let facturaEngine = new Engine();

// Agregar un operador personalizado para comprobar la similitud
facturaEngine.addOperator('similarTo', (factValue, jsonValue) => {
    const distance = levenshteinDistance(factValue, jsonValue.value);
    const similarity = (1 - distance / Math.max(factValue.length, jsonValue.value.length));
    return similarity >= jsonValue.threshold;
});

// Definir la regla usando el operador personalizado
facturaEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: 100
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: 'El documento cuenta con la información correspondiente.'
        }
    }
});


module.exports = { facturaEngine };
