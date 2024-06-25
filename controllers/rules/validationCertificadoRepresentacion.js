const Institucion = require('../../models/institucion'); // Ajusta la ruta según sea necesario
const Laboratorio = require('../../models/laboratorios'); // Ajusta la ruta según sea necesario

async function defaultFunction(OCRtext) {
    let contador = 0;
    let total = 2;

    let flagFechaCertificadoRepresentacionLegal = false;
    let flagLaboratorioCertificadoRepresentacionLegal = false;
    let flagCertificadoRepresentacionLegal = false

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

            //Verificar si es Certificado de Representación Legal
            if (texto.includes(normalizeText('certificado de representacion legal')) && flagCertificadoRepresentacionLegal === false) {
                flagCertificadoRepresentacionLegal = true;
            }


            // Verificar el año actual o anterior
            if ((texto.includes(currentYear.toString()) || texto.includes(previousYear.toString())) && flagFechaCertificadoRepresentacionLegal === false) {
                contador++;
                flagFechaCertificadoRepresentacionLegal = true;
            }

            // Verificar el nombre de algún laboratorio
            laboratorios.some(laboratorio => {
                if (texto.includes(normalizeText(laboratorio.nombre)) && flagLaboratorioCertificadoRepresentacionLegal === false) {
                    contador++;
                    flagLaboratorioCertificadoRepresentacionLegal = true;
                }
                return flagLaboratorioCertificadoRepresentacionLegal;
            });

            console.log(texto);
            console.log(contador);
        }

    });
    let validez = 0;

    if (flagFechaCertificadoRepresentacionLegal && flagLaboratorioCertificadoRepresentacionLegal) {
        validez = (contador / total) * 100;
    }
    if (!flagFechaCertificadoRepresentacionLegal) {
        validez += -16;
    }
    if (!flagLaboratorioCertificadoRepresentacionLegal) {
        validez += -8;
    }
    if (!flagCertificadoRepresentacionLegal) {
        validez = -400;
    }

    return validez;
}

module.exports = defaultFunction;