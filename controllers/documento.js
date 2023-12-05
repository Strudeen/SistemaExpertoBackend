const { response, request } = require('express');
const Documento = require('../models/documentos');


const getDocumentos = async (req = request, res = response) => {
    const documentos = await Documento.find({});

    res.json(documentos);
}

const postDocumento = async (req = request, res = response) => {
    const { nombre, validacion, fotoURL, } = req.body;
    const documento = new Documento({
        nombre, validacion, fotoURL, state: true,
    })
    await documento.save();
    res.status(201).json({
        msg: 'Documento añadido exitosamente.',
        documento,
    });
}

const putDocumento = async (req = request, res = response) => {
    const documentoId = req.params.id;
    const { nombre, validacion, fotoURL, } = req.body;

    try {

        const documento = await Documento.findById(documentoId);

        if (!documento) {
            return res.status(404).json({ msg: 'Documento no encontrado' });
        }

        documento.codigo = codigo;
        documento.validacion = validacion;
        documento.fotoURL = fotoURL;
 
        await documento.save();

        res.json({
            msg: 'Documento actualizado exitosamente.',
            documento,
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el documento.' });
    }

}


const getDocumento = async (req = request, res = response) => {
    const documentoId = req.params.id

    const documento = await Documento.findById(documentoId);

    res.status(200).json(
        documento
    );
}



const delDocumento = async (req = request, res = response) => {
    const documentoId = req.params.id;
    const { state } = req.body;

    try {
        const documento = await Inventario.findById(medicamentoId);

        if (!documento) {
            return res.status(404).json({ msg: 'Documento no encontrado' });
        }

        documento.state = state;

        await documento.save();

        res.json({
            msg: 'Estado del documento actualizado exitosamente.',
            documento,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el estado del documento.' });
    }
}


module.exports = { getDocumentos, postDocumento, putDocumento, delDocumento, getDocumento };
