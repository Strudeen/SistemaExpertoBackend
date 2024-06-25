const Institucion = require('../../models/institucion'); // Ajusta la ruta según sea necesario
const Laboratorio = require('../../models/laboratorios'); // Ajusta la ruta según sea necesario

async function defaultFunction(OCRtext) {
    let contador = 0;
    let total = 1;

    // let flagFechaRegistroSanitario = false;
    let flagLaboratorioRegistroSanitario = false;
    let flagRegistroSanitario = false;

    const laboratorios = await Laboratorio.find({});

    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;


    const normalizeText = (text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    //Procesar y mostrar la respuesta
    OCRtext.Blocks.forEach(block => {
        if (block.BlockType === 'LINE') {
            const texto = normalizeText(block.Text);

            //Verificar si es Registro Sanitario
            if (texto.includes(normalizeText('registro sanitario')) && flagRegistroSanitario === false) {
                flagRegistroSanitario = true;
            }


            // Verificar el año actual o anterior
            // if ((texto.includes(currentYear.toString()) || texto.includes(previousYear.toString())) && flagFechaRegistroSanitario === false) {
            //     contador++;
            //     flagFechaRegistroSanitario = true;
            // }

            // Verificar el nombre de algún laboratorio
            laboratorios.some(laboratorio => {
                if (texto.includes(normalizeText(laboratorio.nombre)) && flagLaboratorioRegistroSanitario === false) {
                    contador++;
                    flagLaboratorioRegistroSanitario = true;
                }
                return flagLaboratorioRegistroSanitario;
            });

            console.log(texto);
            console.log(contador);
        }

    });

    let validez = 0;

    if (flagLaboratorioRegistroSanitario) {
        validez = (contador / total) * 100;
    }
    // if (!flagFechaRegistroSanitario) {
    //     validez += -16;
    // }
    if (!flagLaboratorioRegistroSanitario) {
        validez += -8;
    }
    if (!flagRegistroSanitario) {
        validez = -200;
    }


    return validez;

}

module.exports = defaultFunction;