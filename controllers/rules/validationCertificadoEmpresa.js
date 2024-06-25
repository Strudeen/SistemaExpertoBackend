const Institucion = require('../../models/institucion'); // Ajusta la ruta según sea necesario
const Laboratorio = require('../../models/laboratorios'); // Ajusta la ruta según sea necesario

async function defaultFunction(OCRtext) {
    let contador = 0;
    let total = 2;

    let flagFechaCertificadoEmpresa = false;
    let flagLaboratorioCertificadoEmpresa = false;
    let flagCertificadoEmpresa = false

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

            //Verificar si es Certificado de Empresa
            if (texto.includes(normalizeText('certificado de empresa')) && flagCertificadoEmpresa === false) {
                flagCertificadoEmpresa = true;
            }


            // Verificar el año actual o anterior
            if ((texto.includes(currentYear.toString()) || texto.includes(previousYear.toString())) && flagFechaCertificadoEmpresa === false) {
                contador++;
                flagFechaCertificadoEmpresa = true;
            }

            // Verificar el nombre de algún laboratorio
            laboratorios.some(laboratorio => {
                if (texto.includes(normalizeText(laboratorio.nombre)) && flagLaboratorioCertificadoEmpresa === false) {
                    contador++;
                    flagLaboratorioCertificadoEmpresa = true;
                }
                return flagLaboratorioCertificadoEmpresa;
            });

            console.log(texto);
            console.log(contador);
        }

    });

    let validez = 0;

    if (flagFechaCertificadoEmpresa && flagLaboratorioCertificadoEmpresa) {
        validez = (contador / total) * 100;
    }
    if (!flagFechaCertificadoEmpresa) {
        validez += -16;
    }
    if (!flagLaboratorioCertificadoEmpresa) {
        validez += -8;
    }
    if (!flagCertificadoEmpresa) {
        validez = -800;
    }

    return validez;
}

module.exports = defaultFunction;