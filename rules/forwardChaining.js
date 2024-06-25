const { Engine } = require('json-rules-engine');

// Crear un nuevo motor de reglas
let forwardChainingEngine = new Engine();

// Definir un operador personalizado
forwardChainingEngine.addOperator('allGreaterThan50', (factValue = [], jsonValue) => {
    // Verificar que cada elemento en el array sea mayor a 80
    let flagGreaterThan50 = true;
    
    factValue.forEach(fV => {
        console.log('FV', fV);
        if (fV < 50) {
            flagGreaterThan50 = false;
            
        }
    });
    console.log('factvalue', factValue.length);
    if (!(factValue.length > 0)) {
        flagGreaterThan50 = false;
    }
    console.log(flagGreaterThan50);
    return flagGreaterThan50;

});

// Definir la regla que usa el operador personalizado
forwardChainingEngine.addRule({
    conditions: {
        all: [{
            fact: 'numbersArray',
            operator: 'allGreaterThan50',
            value: true // Este valor no se usa, pero es necesario para el formato del operador
        }]
    },
    event: {
        type: 'allNumbersValid',
        params: {
            message: ['Las firmas del documento han sido correctamente validadas']
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        all: [{
            fact: 'agemedStamp',
            operator: 'greaterThanInclusive',
            value: 47
        }]
    },
    event: {
        type: 'agemedStampValid',
        params: {
            message: ['El documento cuenta con el sello valido de la AGEMED']
        }
    }
});



// Definir la reglas
forwardChainingEngine.addRule({
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
            message: ['El documento cuenta con la información correspondiente']
        }
    }
});
// 1
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -1
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: ['El documento no cuenta con el NIT de la institución']
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -2
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: ['El documento no cuenta con el NIT del laboratorio.']
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -3
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                'El documento no cuenta con el NIT de la institución',
                'El documento no cuenta con el NIT del laboratorio'
            ]
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -4
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: ['El documento no cuenta con el nombre de la institución']
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -5
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                'El documento no cuenta con el nombre de la institución',
                'El documento no cuenta con el NIT de la institución'
            ]
        }
    }
});
// 5
//6
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -6
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                'El documento no cuenta con el nombre de la institución',
                'El documento no cuenta con el NIT del laboratorio'
            ]
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -7
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                'El documento no cuenta con el nombre de la institución',
                'El documento no cuenta con el NIT de la institución',
                'El documento no cuenta con el NIT del laboratorio',
            ]
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -8
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: ['El documento no cuenta con el nombre del laboratorio']
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -9
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                'El documento no cuenta con el nombre del laboratorio',
                'El documento no cuenta con el NIT de la institución'
            ]
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -10
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                'El documento no cuenta con el nombre del laboratorio',
                'El documento no cuenta con el NIT del laboratorio'
            ]
        }
    }
});
//10
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -11
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                'El documento no cuenta con el nombre del laboratorio',
                'El documento no cuenta con el NIT del laboratorio',
                'El documento no cuenta con el NIT de la institución'
            ]
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -12
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                'El documento no cuenta con el nombre del laboratorio',
                'El documento no cuenta con el nombre de la institución'
            ]
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -13
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                'El documento no cuenta con el nombre del laboratorio',
                'El documento no cuenta con el nombre de la institución',
                'El documento no cuenta con el NIT de la institución'
            ]
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -14
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                'El documento no cuenta con el nombre del laboratorio',
                'El documento no cuenta con el nombre de la institución',
                'El documento no cuenta con el NIT del laboratorio'
            ]
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -15
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                'El documento no cuenta con el nombre del laboratorio',
                'El documento no cuenta con el nombre de la institución',
                'El documento no cuenta con el NIT del laboratorio',
                'El documento no cuenta con el NIT de la institución',
            ]
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -16
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: ['El documento no cuenta con una fecha valida.']
        }
    }
});
//16 - JOEL
//17
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -17
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) de la Institución`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});
//18
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -18
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) del Laboratorio`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});
//19
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -19
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) de la Institución`,
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) del Laboratorio`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});
//20
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -20
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Nombre de la Institución`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});
//21
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'c',
            operator: 'equal',
            value: -21
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Número de Identificación Tributaria (NIT) de la Institución`,
                `El documento no cuenta con el Nombre de la Institución`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});
//22
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -22
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) de la Institución`,
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) del Laboratorio`,
                `El documento no cuenta con el Nombre de la Institución`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});
//23
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -23
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) de la Institución`,
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) del Laboratorio`,
                `El documento no cuenta con el Nombre de la Institución`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});
//24
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -24
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Nombre del Laboratorio`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});
//25
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -25
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) de la Institución`,
                `El documento no cuenta con el Nombre del Laboratorio`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});
//26
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -26
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) del Laboratorio`,
                `El documento no cuenta con el Nombre del Laboratorio`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});
//27
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -27
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) de la Institución`,
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) del Laboratorio`,
                `El documento no cuenta con el Nombre del Laboratorio`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});
//28
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -28
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Nombre de la Institución`,
                `El documento no cuenta con el Nombre del Laboratorio`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});
//29
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -29
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) de la Institución`,
                `El documento no cuenta con el Nombre de la Institución`,
                `El documento no cuenta con el Nombre del Laboratorio`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});
//30
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -30
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) del Laboratorio`,
                `El documento no cuenta con el Nombre de la Institución`,
                `El documento no cuenta con el Nombre del Laboratorio`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});
//31
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -31
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) de la Institución`,
                `El documento no cuenta con el Numero de Identificación Tributaria (NIT) del Laboratorio`,
                `El documento no cuenta con el Nombre de la Institución`,
                `El documento no cuenta con el Nombre del Laboratorio`,
                `El documento no cuenta con una Fecha válida`,
            ]
        }
    }
});

//VALIDACION DE TIPO DE DOCUMENTO
forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -100
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no es una factura`
            ]
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -200
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no es un Registro Sanitario`
            ]
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -400
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no es un Certificado de Representación Legal`
            ]
        }
    }
});

forwardChainingEngine.addRule({
    conditions: {
        any: [{
            fact: 'validationValue',
            operator: 'equal',
            value: -800
        }]
    },
    event: {
        type: 'ocrValidated',
        params: {
            message: [
                `El documento no es un Certificado de Empresa`
            ]
        }
    }
});


module.exports = { forwardChainingEngine };
