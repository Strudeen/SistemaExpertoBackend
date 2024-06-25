const Institucion = require('../../models/institucion'); // Ajusta la ruta según sea necesario
const Laboratorio = require('../../models/laboratorios'); // Ajusta la ruta según sea necesario

async function defaultFunction(OCRtext) {
    let contador = 0;
    let total = 5;

    let flagInstitucionPrincipal = false;
    let flagInstitucionNit = false;
    let flagFechaFactura = false;
    let flagLaboratorioFactura = false;
    let flagLaboratorioNit = false;

    let flagFactura = false;

    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    const institucion = await Institucion.findById('666b7a7c668f4890e555863b');
    const laboratorios = await Laboratorio.find({});

    const normalizeText = (text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    //Procesar y mostrar la respuesta
    OCRtext.Blocks.forEach(block => {
        if (block.BlockType === 'LINE') {
            const texto = normalizeText(block.Text);

            //Verificar si es Factura
            if (texto.includes(normalizeText('factura')) && flagFactura === false) {
                flagFactura = true;
            }


            // Verificar el nombre de la institución
            if (texto.includes(normalizeText(institucion.institucionPrincipal)) && flagInstitucionPrincipal === false) {
                contador++;
                flagInstitucionPrincipal = true
            }

            // Verificar el NIT de la institución
            if (texto.includes(' ' + normalizeText(institucion.institucionNit)) && flagInstitucionNit === false) {
                contador++;
                flagInstitucionNit = true
            }

            // Verificar el año actual o anterior
            if ((texto.includes(currentYear.toString()) || texto.includes(previousYear.toString())) && flagFechaFactura === false) {
                contador++;
                flagFechaFactura = true;
            }

            // Verificar el nit de algún laboratorio
            laboratorios.some(laboratorio => {
                if (texto.includes(normalizeText(laboratorio.nit)) && flagLaboratorioFactura === false) {
                    contador++;
                    flagLaboratorioNit = true;
                }
                return flagLaboratorioFactura;
            });

            // Verificar el nombre de algún laboratorio
            laboratorios.some(laboratorio => {
                if (texto.includes(normalizeText(laboratorio.nombre)) && flagLaboratorioFactura === false) {
                    contador++;
                    flagLaboratorioFactura = true;
                }
                return flagLaboratorioFactura;
            });
            console.log(texto);
            console.log(contador);
        }

    });
    let validez = 0;

    if (flagFechaFactura && flagInstitucionNit && flagInstitucionPrincipal && flagLaboratorioFactura && flagLaboratorioNit) {
        validez = (contador / total) * 100;
    }
    if (!flagFechaFactura) {
        validez += -16;
    }
    if (!flagInstitucionNit) {
        validez += -1;
    }
    if (!flagInstitucionPrincipal) {
        validez += -4;
    }
    if (!flagLaboratorioFactura) {
        validez += -8;
    }
    if (!flagLaboratorioNit) {
        validez += -2;
    }
    if (!flagFactura) {
        validez = -100;
    }

    return validez;
}

module.exports = defaultFunction;