const { response, request } = require('express');
const Almacen = require('../models/almacenes');
const mongoose = require('mongoose');

const getAlmacenes = async (req = request, res = response) => {
    try {
        const almacenes = await Almacen.find({ state: true });
        res.json(almacenes);
    } catch {
        res.status(404).json({
            msg: 'Sin resultados',
        });
    }
}

const getAllAlmacenes = async (req = request, res = response) => {
    try {
        const almacenes = await Almacen.find({});
        res.json(almacenes);
    } catch {
        res.status(404).json({
            msg: 'Sin resultados',
        });
    }

}

const getAlmacen = async (req = request, res = response) => {
    try {
        const almacenId = req.params.id
        const almacenes = await Almacen.findById(almacenId);
        res.json(almacenes);
    } catch (error) {
        res.status(404).json({
            msg: 'Almacen no encontrado',
        });
    }

}

const postAlmacen = async (req = request, res = response) => {
    const { codigoMedicamento } = req.body;
    const almacen = new Almacen({
        _id: new mongoose.Types.ObjectId(),
        codigoMedicamento, cantidad: 0
    })
    
    await almacen.save();
    res.status(201).json({
        msg: 'Almacen añadido exitosamente.',
        almacen,
    });
}

const putAlmacen = async (req = request, res = response) => {
    const almacenId = req.params.id;
    const { codigoMedicamento, cantidad } = req.body;

    try {

        const almacen = await Almacen.findById(almacenId);

        if (!almacen) {
            return res.status(404).json({ msg: 'Almacen no encontrado' });
        }

        almacen.codigoMedicamento = codigoMedicamento;
        almacen.cantidad = cantidad;

        await almacen.save();

        res.json({
            msg: 'Almacen actualizado exitosamente.',
            almacen,
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el almacen.' });
    }
}

const delAlmacen = async (req = request, res = response) => {
    const almacenId = req.params.id;
    const { state } = req.body;
    try {
        const almacen = await Almacen.findById(almacenId);
        if (!almacen) {
            return res.status(404).json({ msg: 'Almacen no encontrado' });
        }

        almacen.state = state;
        await almacen.save();

        res.json({
            msg: 'Almacen eliminado exitosamente.',
            almacen,
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar el almacen.' });
    }
}


module.exports = { getAlmacenes, getAlmacen, getAllAlmacenes, postAlmacen, putAlmacen, delAlmacen };