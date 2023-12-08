const { response, request } = require('express');
const { facturaEngine } = require('../rules/facturaRules');
const { Engine } = require('json-rules-engine')
const { certificadoEmpresaEngine } = require('../rules/certificadoEmpresaRules');


const postOCR = async (req = request, res = response) => {
    let { texto } = req.body;

    texto = texto.toLowerCase();
    console.log('Texto OCR:', texto);

    // Usar una expresión regular para extraer el nombre/razón social/señores
    const nombreRegex1 = /nombre\/razón social\s*(.+?)(?:\s*—|\s*\-|\s*cod\.)/i;
    const fechaRegex = /fecha:\s*\d{1,2}\s*de\s*\w+\s*de\s*(\d{4})/i;



    const nombreRegex2 = /(?:nombre\/razón social|señores):\s*([^\|]+)/i;
    const nombre1 = (nombreRegex2.exec(texto) || [])[1]?.trim() || ''
    const nombre2 = (nombreRegex1.exec(texto) || [])[1]?.trim() || ''

      // Intentar extraer la fecha
      const fechaMatch = fechaRegex.exec(texto);
      const anoFactura = fechaMatch ? fechaMatch[1] : '';
    
      console.log(anoFactura);
    // Ahora puedes hacer algo similar para extraer el NIT, fecha y otros datos...

    // Preparar los hechos para la validación
    let combinatedFacts = {
        nombre1: nombre1,
        nombre2: nombre2,
        anoFactura: anoFactura
    };


    // Ejecutar el motor de reglas con los hechos extraídos
    facturaEngine
        .run(combinatedFacts)
        .then(({ events }) => {
            // Si no hay eventos, entonces alguna validación falló
            if (events.length === 0) {
                return res.json({ message: "Validación fallida." });
            }
            // Si hay eventos, las validaciones fueron exitosas
            const messages = events.map(event => event.params.message);
            res.json({ validaciones: messages, isValid: true });
        })
        .catch(err => {
            console.error(err);
            res.json({  message: "Error al procesar la validación." });
        });
}




const postOCRCertificadoEmpresa = async (req = request, res = response) => {
    let { texto } = req.body;
    texto = texto.toLowerCase();

    // Ajustar la expresión regular para extraer el nombre de la agencia
    const nombreAgenciaRegex = /agemed/i;
    const tituloCertificadoRegex = /certificado de empresa/i;
    const fechaRegex = /la paz,\s*\d+\s*de\s*\w+\s*de\s*(\d{4})/i;

    const nombreAgenciaMatch = nombreAgenciaRegex.exec(texto);
    const tituloCertificadoMatch = tituloCertificadoRegex.exec(texto);
    const fechaMatch = fechaRegex.exec(texto);

    // Verificar si se encontraron los datos
    if (!nombreAgenciaMatch || !tituloCertificadoMatch || !fechaMatch) {
        return res.json({ isValid: false, message: "No se pudieron extraer todos los datos necesarios." });
    }

    // Extraer los datos encontrados
    const nombreAgencia = nombreAgenciaMatch[0].trim(); // Aquí extraemos directamente el nombre de la agencia
    const tituloCertificado = tituloCertificadoMatch[0].trim(); // Confirmar la presencia del título
    const anoCertificado = fechaMatch[1];

    console.log('Nombre Agencia Encontrado:', nombreAgencia);
    console.log('Título Certificado Encontrado:', tituloCertificado);
    console.log('Año Certificado Encontrado:', anoCertificado);

    // Crear los hechos para el motor de reglas
    const facts = {
        nombreAgencia: nombreAgencia,
        tituloCertificado: tituloCertificado,
        anoCertificado: anoCertificado
    };

    // Ejecutar el motor de reglas
    certificadoEmpresaEngine.run(facts).then(results => {
        if (results.events.length > 0) {
            // Si hay eventos, el documento es válido
            res.json({ isValid: true, message: results.events[0].params.message });
        } else {
            // Si no hay eventos, el documento no es válido
            res.json({ isValid: false, message: "El documento no cumple con los criterios." });
        }
    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: "Error al procesar la validación." });
    });
};

module.exports = { postOCRCertificadoEmpresa };
module.exports = { postOCR, postOCRCertificadoEmpresa };