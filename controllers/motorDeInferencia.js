const { response, request } = require('express');
const { facturaEngine } = require('../rules/facturaRules');
const { Engine } = require('json-rules-engine')
const { forwardChainingEngine } = require('../rules/forwardChaining');
const { TextractClient, AnalyzeDocumentCommand, StartDocumentAnalysisCommand, GetDocumentAnalysisCommand } = require("@aws-sdk/client-textract");
const fs = require('fs'); // Para manejar la lectura de archivos locales
const rulesContainer = require('./rules/rulesContainer');
const defaultFunction = require('./rules/defaultFunction');
const validationFactura = require('./rules/validationFactura');
const validationRegistroSanitario = require('./rules/validationRegistroSanitario');
const validationCertificadoEmpresa = require('./rules/validationCertificadoEmpresa');
const validationCertificadoRepresentacion = require('./rules/validationCertificadoRepresentacion');
const loadOpenCV = require('../loadOpenCV');
const { Canvas, createCanvas, Image, ImageData, loadImage } = require('canvas');
const { JSDOM } = require('jsdom');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const path = require('path');



const postFileValidation = async (req, res) => {

    const files = req.file;
    const { typeDocument } = req.params;

    const { filename } = files;

    const message = await validateText(filename, typeDocument);
    console.log(message);
    let valid = true;
    if (message && message.length > 0) {
        valid = false;
    }

    res.json({ message: message, valid });
}

const validateText = async (filename, typeDocument) => {
    try {

        // Leer el archivo local en un buffer
        const imageBytes = fs.readFileSync(`documents/${filename}`);

        // Configurar los parámetros para Textract
        const params = {
            Document: {
                Bytes: imageBytes
            },
            FeatureTypes: ['TABLES', 'FORMS', 'SIGNATURES'] // Opcional, especifica qué tipo de análisis realizar
        };


        // Crear el comando para Textract
        const command = new AnalyzeDocumentCommand(params);

        // Ejecutar el comando y obtener la respuesta
        const response = await client.send(command);


        const blocks = response.Blocks;

        // Filtrar y mostrar los resultados de detección de firmas
        const signatures = blocks.filter(block => block.BlockType === "SIGNATURE");

        let signatureConfidence = signatures.map(signature => {
            return signature.Confidence
        });

        let validateDocument;

        //Sellos
        const result = await detectForms(`documents/${filename}`)
        console.log("RESULTADOS IMAGENES", result);

        let max = result.reduce((a, b) => Math.max(a, b), -Infinity);
        console.log(max);

        switch (typeDocument) {

            case '1':
                validateDocument = new rulesContainer(response, validationFactura);
                signatureConfidence = [];
                max = 0;
                break;

            case '2':
                validateDocument = new rulesContainer(response, validationRegistroSanitario);

                break;

            case '3':
                validateDocument = new rulesContainer(response, validationCertificadoEmpresa);

                break;

            case '4':
                validateDocument = new rulesContainer(response, validationCertificadoRepresentacion);

                break;
        }
        const validationValue = await validateDocument.validate();
        console.log(validationValue);

        const facts = {
            validationValue: validationValue,
            c: "",
            numbersArray: signatureConfidence,
            agemedStamp: max
        };
        let message = [];

        const { events } = await forwardChainingEngine.run(facts);

        const allNumbers = events.find(result => result.type === 'allNumbersValid');
        const agemedStamp = events.find(result => result.type === 'agemedStampValid');
        message = events.map(result => {

            console.log('RESULT :', result);

            if (result.type !== 'allNumbersValid' && result.type !== 'agemedStampValid')
                return result.params.message;
        });
        message = message.flat();
        if (allNumbers) {
            const [msg] = allNumbers.params.message;
            if (message[0] === undefined) {
                message[0] = msg;
            } else {
                message.push(msg);
            }
        } else {
            if (message[0] === undefined) {
                message[0] = 'No existen firmas o no son validas';
            } else {
                message.push('No existen firmas o no son validas');
            }
        }

        if (agemedStamp) {
            const [msg] = agemedStamp.params.message;
            if (message[1] === undefined) {
                message[1] = msg;
            } else {
                message.push(msg);
            }
        } else {
            if (message[1] === undefined) {
                message[1] = 'No cuenta con el sello de la agemed';
            } else {
                message.push('No cuenta con el sello de la agemed');
            }
        }

        return message;

    } catch (error) {
        console.error('Error al analizar el documento:', error);
    }


}

async function detectForms(documentPath) {
    await loadOpenCV();

    const imageC = await loadImage(documentPath);
    const src = cv.imread(imageC);

    const canvas = createCanvas(src.cols, src.rows);

    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    let blur = new cv.Mat();
    cv.bilateralFilter(gray, blur, 15, 15, 15);  // Aumentar la intensidad del filtro bilateral

    let edges = autoCanny(blur);
    cv.imshow(canvas, edges);
    //writeFileSync(`result/${Date.now()}-edges.png`, canvas.toBuffer('image/jpeg'));

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);
    //console.log(`Total nr of contours found: ${contours.size()}`);

    let topN = 10;
    let sortedContours = [];
    for (let i = 0; i < contours.size(); ++i) {
        sortedContours.push(contours.get(i));
    }
    sortedContours.sort((a, b) => cv.contourArea(b) - cv.contourArea(a));
    sortedContours = sortedContours.slice(0, topN);

    let filteredCircle = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC1);
    let sortedContoursMatVector = new cv.MatVector();
    sortedContours.forEach(contour => sortedContoursMatVector.push_back(contour));

    cv.drawContours(filteredCircle, sortedContoursMatVector, -1, new cv.Scalar(255, 255, 255, 255), cv.FILLED);

    cv.imshow(canvas, filteredCircle);
    //writeFileSync(`result/${Date.now()}-filteredCircle.png`, canvas.toBuffer('image/jpeg'));

    let kernel = cv.Mat.ones(3, 3, cv.CV_8U);
    let closedCircle = new cv.Mat();
    cv.morphologyEx(filteredCircle, closedCircle, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 1);  // Aumentar las iteraciones

    cv.imshow(canvas, closedCircle);
    //writeFileSync(`result/${Date.now()}-closedCircle.png`, canvas.toBuffer('image/jpeg'));

    let filteredContours = new cv.MatVector();
    let hierarchy2 = new cv.Mat();
    cv.findContours(closedCircle, filteredContours, hierarchy2, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);

    let shapeContours = [];
    for (let i = 0; i < filteredContours.size(); ++i) {
        let contour = filteredContours.get(i);
        let perimeter = cv.arcLength(contour, true);
        let approxPoints = new cv.Mat();
        cv.approxPolyDP(contour, approxPoints, 0.04 * perimeter, true);

        if (approxPoints.size().height > 5) {
            shapeContours.push(contour);
        } else if (approxPoints.size().height === 4) {
            // Detect squares and rectangles
            let rect = cv.boundingRect(contour);
            let aspectRatio = rect.width / rect.height;
            if (aspectRatio >= 0.8 && aspectRatio <= 1.2) {
                shapeContours.push(contour);  // Square
            } else {
                shapeContours.push(contour);  // Rectangle
            }
        } else if (approxPoints.size().height === 5) {
            // Detect pentagons
            shapeContours.push(contour);
        }

        approxPoints.delete();
    }

    let shapeContoursMatVector = new cv.MatVector();
    shapeContours.forEach(contour => shapeContoursMatVector.push_back(contour));

    let out = src.clone();
    cv.drawContours(out, shapeContoursMatVector, -1, new cv.Scalar(255, 0, 0, 255), 2, cv.LINE_AA);

    cv.imshow(canvas, out);
    //writeFileSync(`result/${Date.now()}-out.png`, canvas.toBuffer('image/jpeg'));

    const values = [];
    // Cortar y guardar las detecciones en imágenes separadas
    for (let contour of shapeContours) {
        let rect = cv.boundingRect(contour);
        let cropped = src.roi(rect);
        const cropCanvas = createCanvas(cropped.cols, cropped.rows);
        cv.imshow(cropCanvas, cropped);

        //Aca Tenemos que comparar
        // Cargar las imágenes de referencia
        const referenceImagesDir = 'sellosValidos';
        const referenceImages = await loadImagesFromDir(referenceImagesDir);
        console.log("IMAGENES", referenceImages);
        let bestMatch = null;
        let lowestDiff = 0;
        referenceImages.forEach((refImage, index) => {
            const diff = compareImages(cropped, refImage);
            values.push(diff);
        });
        cropped.delete();
        // Liberar memoria de las imágenes de referencia
        referenceImages.forEach(refImg => refImg.delete());
    }
    // Cleanup
    src.delete();
    gray.delete();
    blur.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
    filteredCircle.delete();
    kernel.delete();
    closedCircle.delete();
    filteredContours.delete();
    hierarchy2.delete();
    out.delete();
    sortedContoursMatVector.delete();
    shapeContoursMatVector.delete();
    return values;
}

function autoCanny(gray, sigma = 0.33) {
    let v = cv.mean(gray)[0];
    let lower = Math.max(0, (1.0 - sigma) * v);
    let upper = Math.min(255, (1.0 + sigma) * v);
    let edges = new cv.Mat();
    cv.Canny(gray, edges, lower, upper);
    return edges;
}

// Función para cargar imágenes desde un directorio
async function loadImagesFromDir() {
    const files = fs.readdirSync('sellosValidos');
    const referencias = [];
    for (let file of files) {
        console.log(`sellosValidos/${file}`);
        const imageC = await loadImage(`sellosValidos/${file}`);
        referencias.push(cv.imread(imageC));
    }
    return referencias;
}

function compareImages(img1, img2) {
    const resizedImg1 = new cv.Mat();
    const resizedImg2 = new cv.Mat();
    const diff = new cv.Mat();

    const nP = img2.cols * img2.rows * 255;
    console.log("Cantidad de Pixeles", nP);
    const size = new cv.Size(img2.cols, img2.rows);
    cv.resize(img1, resizedImg1, size);
    cv.resize(img2, resizedImg2, size);
    console.log('Resized Images Cols:', resizedImg1.cols, resizedImg2.cols);
    console.log('Resized Images Rows:', resizedImg1.rows, resizedImg2.rows);
    // Calculate absolute difference
    cv.absdiff(resizedImg1, resizedImg2, diff);
    console.log('DIFF', diff);

    // Calculate the sum of absolute difference (SAD) manually
    // let diffSum = 0;
    // for (let row = 0; row < diff.rows; row++) {
    //     for (let col = 0; col < diff.cols; col++) {
    //         for (let channel = 0; channel < diff.channels(); channel++) {
    //             diffSum += diff.ucharPtr(row, col)[channel];
    //         }
    //     }
    // }

    //Compute the sum of absolute difference (for testing)
    let diffSum = 0
    for (row = 0; row < diff.rows; row++) {
        for (col = 0; col < diff.cols; col++) {
            diffSum += diff.ucharPtr(row, col)[0] + diff.ucharPtr(row, col)[1] + diff.ucharPtr(row, col)[2];
            //d.ucharPtr(row, col)[3] = 255; //Set the alpha (transparency) channel to 255 for testing.
        }
    }

    const porcentaje = 100 - (diffSum / (nP)) * 100;
    console.log("Porcentaje", porcentaje);

    console.log('Diff Sum:', diffSum);

    // Clean up to prevent memory leaks
    resizedImg1.delete();
    resizedImg2.delete();
    diff.delete();

    return porcentaje; // A lower value indicates higher similarity
}



// Comparar la imagen recortada con cada imagen de referencia


module.exports = { postFileValidation };