const { response, request } = require('express');
const mongoose = require('mongoose');
const InventarioMedicamentos = require('../models/inventarioMedicamentos');
const Inventarios = require('../models/inventarios');

const getInventariosMedicamentos = async (req = request, res = response) => {
    try{
        const inventarioId = req.params.id;
        const inventarioMedicamento = await Inventarios.findOne({ _id: inventarioId });
        await inventarioMedicamento.populate('datos');
        const {datos} = inventarioMedicamento
        res.json(inventarioMedicamento);
    } catch (error) {
        res.status(404).json({ msg: 'Inventario Medicamento no encontrado' });
        console.log({ msg: 'Hubo un error', error});
    }
}

const getAllInventariosMedicamentos = async (req = request, res = response) => {
    try {
        const inventarioId = req.params.id;
        const inventarioMedicamentos = await Inventarios.findOne({ state:true, _id: inventarioId }).populate('InventarioMedicamentos');
        const {datos} = inventarioMedicamentos
        res.json(datos);
    } catch (error) {
        res.status(404).json({ msg: 'Inventario Medicamento no encontrado' });
        console.log({ msg: 'Hubo un error', error});
    }

}

const getInventarioMedicamento = async (req = request, res = response) => {
    try {
        const inventarioId = req.params.id;
        const inventarioMedicamentos = await InventarioMedicamentos.findOne({ state:true, _id: inventarioId });
        res.json(inventarioMedicamentos);
    } catch (error) {
        res.status(404).json({ msg: 'Inventario Medicamento no encontrado' });
        console.log({ msg: 'Hubo un error', error});
    }

}

const postInventarioMedicamento = async (req, res) => {
    try {
        const inventarioId = req.params.id;
        const { fechaCaducidad, codigoLaboratorio, cantidad, nroLote } = req.body;
        const inventario = await Inventarios.findById(inventarioId);

        if (!inventario) {
            return res.status(404).json({ msg: 'Inventario no encontrado' });
        }



        const inventarioMedicamento = new InventarioMedicamentos({
            _id: new mongoose.Types.ObjectId(),
            fechaCaducidad,
            codigoLaboratorio,
            cantidad,
            nroLote,
            inventarios: inventarioId
        });


        await inventarioMedicamento.save();

        inventario.datos.push(inventarioMedicamento._id);

        inventario.cantidad += parseInt(cantidad);

        await inventario.save();

        res.status(201).json({
            msg: 'Inventario Medicamento añadido exitosamente.',
            inventarioMedicamento
        });
    } catch (error) {
        console.error({ msg: 'Hubo un error', error });
        res.status(500).json({ msg: 'Error al procesar la solicitud' });
    }
}

const putInventarioMedicamento = async (req, res) => {
    const inventarioMedicamentoId = req.params.id;
    const { fechaCaducidad, codigoLaboratorio, cantidad, nroLote } = req.body;

    try {
        const inventarioMedicamento = await InventarioMedicamentos.findById(inventarioMedicamentoId).populate('inventarios');

        if (!inventarioMedicamento) {
            return res.status(404).json({ msg: 'Inventario Medicamento no encontrado' });
        }


        let cantidadDiferencia = cantidad - inventarioMedicamento.cantidad;


        inventarioMedicamento.fechaCaducidad = fechaCaducidad;
        inventarioMedicamento.codigoLaboratorio = codigoLaboratorio;
        inventarioMedicamento.cantidad = cantidad;
        inventarioMedicamento.nroLote = nroLote;

        await inventarioMedicamento.save();

        // Encuentra y actualiza el inventario asociado
        if (inventarioMedicamento.inventarios) {
            const inventario = await Inventarios.findById(inventarioMedicamento.inventarios._id);
            if (inventario) {
                inventario.cantidad += cantidadDiferencia;
                await inventario.save();
            }
        }

        res.json({
            msg: 'Inventario Medicamento actualizado exitosamente.',
            inventarioMedicamento,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el inventarioMedicamento.' });
    }
}


const delInventarioMedicamento = async (req, res) => {
    const inventarioMedicamentoId = req.params.id;

    try {
        const inventarioMedicamento = await InventarioMedicamentos.findById(inventarioMedicamentoId).populate('inventarios');

        if (!inventarioMedicamento) {
            return res.status(404).json({ msg: 'Inventario Medicamento no encontrado' });
        }

        // Verificar si el InventarioMedicamento está activo antes de desactivarlo
        if (inventarioMedicamento.state) {
            inventarioMedicamento.state = false;

            if (inventarioMedicamento.inventarios) {
                const inventario = await Inventarios.findById(inventarioMedicamento.inventarios._id);
                if (inventario) {
                    // Reduce la cantidad total en Inventarios
                    inventario.cantidad -= inventarioMedicamento.cantidad;
                    await inventario.save();
                }
            }

            await inventarioMedicamento.save();
            res.json({
                msg: 'Inventario Medicamento desactivado exitosamente.',
                inventarioMedicamento,
            });
        } else {
            res.status(400).json({ msg: 'El Inventario Medicamento ya está desactivado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al desactivar el Inventario Medicamento.' });
    }
}


module.exports = { getInventariosMedicamentos, getInventarioMedicamento, getAllInventariosMedicamentos, postInventarioMedicamento, putInventarioMedicamento, delInventarioMedicamento };