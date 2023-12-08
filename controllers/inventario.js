const { response, request } = require('express');
const Inventario = require('../models/inventarios');
const mongoose = require('mongoose');


const getInventario = async (req = request, res = response) => {
    
    try{
        const inventarioId = req.params.id;
        const inventarios = await Inventario.findOne({ _id:inventarioId });
        res.json(inventarios);
    } catch (error) {
        console.error(error);
        res.status(404).json({ msg: 'Inventario no encontrado.' });
    }
    
}


const getInventarios = async (req = request, res = response) => {
    try{
        const inventarios = await Inventario.find({ state: true });
        res.json(inventarios);
    } catch (error) {
        console.error(error);
        res.status(404).json({ msg: 'Inventario no encontrado.' });
    }
    
}

const getAllInventarios = async (req = request, res = response) => {
    try{
        const invetarios = await Inventario.find({});
        res.json(invetarios);
    }catch (error) {
        console.error(error);
        res.status(404).json({ msg: 'Inventario no encontrado.' });
    }
}

const postInventario = async (req = request, res = response) => {
    const { codigoMedicamento, cantidad } = req.body;
    const inventario = new Inventario({
        _id: new mongoose.Types.ObjectId(),
        codigoMedicamento, cantidad
    })
    await inventario.save();
    res.status(201).json({
        msg: 'Inventario añadido exitosamente.',
        inventario,
    });
}

const putInventario = async (req = request, res = response) => {
    const InventarioId = req.params.id;
    const { codigoMedicamento, cantidad } = req.body;

    try {

        const inventario = await Inventario.findById(InventarioId);

        if (!inventario) {
            return res.status(404).json({ msg: 'Inventario no encontrado' });
        }

        inventario.codigoMedicamento = codigoMedicamento;
        inventario.cantidad = cantidad;
 
        await inventario.save();

        res.json({
            msg: 'Inventario actualizado exitosamente.',
            inventario,
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el inventario.' });
    }
}

const delInventario = async (req = request, res = response) => {
    const  InventarioId = req.params.id;
    const { state } = req.body;
    try {
        const inventario = await inventario.findById(InventarioId);
        if (!inventario) {
            return res.status(404).json({ msg: 'Inventario no encontrado' });
        }

        inventario.state = state;
        await inventario.save();

        res.json({
            msg: 'Inventario eliminado exitosamente.',
            Inventario: inventario,
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar el inventario.' });
    }
}


module.exports = { getInventarios, getAllInventarios, postInventario, putInventario, delInventario, getInventario };
