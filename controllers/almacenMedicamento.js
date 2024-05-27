const { response, request } = require('express');
const AlmacenMedicamento = require('../models/almacenMedicamentos');
const Almacen = require('../models/almacenes');
const mongoose = require('mongoose');

const getAlmacenesMedicamentos = async (req = request, res = response) => {
    const almacenId = req.params.id;
    const almacenMedicamento = await Almacen.findOne({  state:true,_id: almacenId  });
    await almacenMedicamento.populate('datos');
    const {datos} = almacenMedicamento
    res.json(almacenMedicamento);
}

const getAllAlmacenesMedicamentos = async (req = request, res = response) => {
    const almacenId = req.params.id;
    const almacenMedicamento = await Almacen.findOne({ _id: almacenId }).populate('AlmacenMedicamentos');
    const {datos} = almacenMedicamento
    res.json(datos);
}
const getAlmacenMedicamento = async (req = request, res = response) => {
    try {
        const almacenId = req.params.id;
        const almacenoMedicamentos = await AlmacenMedicamento.findOne({ state:true, _id: almacenId });
        res.json(almacenoMedicamentos);
    } catch (error) {
        res.status(404).json({ msg: 'Almacen Medicamento no encontrado' });
        console.log({ msg: 'Hubo un error', error});
    }

}

const postAlmacenMedicamento = async (req, res) => {
    const almacenId = req.params.id;
    const { fechaCaducidad, codigoLaboratorio, cantidad, nroLote } = req.body;

    try {
        // Encuentra el almacen por ID
        const almacen = await Almacen.findById(almacenId);

        if (!almacen) {
            return res.status(404).json({ msg: 'Almacén no encontrado' });
        }

        // Crea un nuevo AlmacenMedicamento
        const almacenMedicamento = new AlmacenMedicamento({
            _id: new mongoose.Types.ObjectId(),
            fechaCaducidad,
            codigoLaboratorio,
            cantidad,
            cantidadInicial:cantidad,
            nroLote,
            almacen: almacenId
        });

        // Guarda el nuevo AlmacenMedicamento
        await almacenMedicamento.save();

        // Añade el nuevo AlmacenMedicamento al almacen
        almacen.datos.push(almacenMedicamento._id);

        // Actualiza la cantidad total en el almacen
        almacen.cantidad += cantidad;

        // Guarda los cambios en el almacen
        await almacen.save();

        res.status(201).json({
            msg: 'Almacen Medicamento añadido exitosamente.',
            almacenMedicamento
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al procesar la solicitud' });
    }
}


const putAlmacenMedicamento = async (req, res) => {
    const almacenMedicamentoId = req.params.id;
    const { fechaCaducidad, codigoLaboratorio, cantidad, nroLote } = req.body;

    try {
        // Encuentra el AlmacenMedicamento por ID
        const almacenMedicamento = await AlmacenMedicamento.findById(almacenMedicamentoId).populate('almacen');

        if (!almacenMedicamento) {
            return res.status(404).json({ msg: 'AlmacenMedicamento no encontrado' });
        }

        // Convertir la fecha de string a objeto Date
        const fechaCaducidadDate = new Date(fechaCaducidad);
        if (isNaN(fechaCaducidadDate.getTime())) {
            return res.status(400).json({ msg: 'Formato de fecha inválido' });
        }

        // Calcula la diferencia de cantidad
        const cantidadDiferencia = cantidad - almacenMedicamento.cantidad;

        // Actualiza AlmacenMedicamentos
        almacenMedicamento.fechaCaducidad = fechaCaducidadDate;
        almacenMedicamento.codigoLaboratorio = codigoLaboratorio;
        almacenMedicamento.cantidad = cantidad;
        almacenMedicamento.nroLote = nroLote;

        await almacenMedicamento.save();

        // Encuentra y actualiza el almacen asociado
        if (almacenMedicamento.almacen) {
            const almacen = await Almacen.findById(almacenMedicamento.almacen._id);
            if (almacen) {
                almacen.cantidad += cantidadDiferencia;
                await almacen.save();
            }
        }

        res.json({
            msg: 'AlmacenMedicamento actualizado exitosamente.',
            almacenMedicamento,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el AlmacenMedicamento.' });
    }
}

const delAlmacenMedicamento = async (req, res) => {
    const almacenMedicamentoId = req.params.id;

    try {
        const almacenMedicamento = await AlmacenMedicamento.findById(almacenMedicamentoId).populate('almacen');

        if (!almacenMedicamento) {
            return res.status(404).json({ msg: 'Almacen Medicamento no encontrado' });
        }

        // Verificar si el AlmacenMedicamento está activo antes de desactivarlo
        if (almacenMedicamento.state) {
            almacenMedicamento.state = false;

            if (almacenMedicamento.almacen) {
                const almacen = await Almacen.findById(almacenMedicamento.almacen._id);
                if (almacen) {
                    // Reduce la cantidad total en Almacenes
                    almacen.cantidad -= almacenMedicamento.cantidad;
                    await almacen.save();
                }
            }

            await almacenMedicamento.save();
            res.json({
                msg: 'Almacen Medicamento desactivado exitosamente.',
                almacenMedicamento,
            });
        } else {
            res.status(400).json({ msg: 'El Almacen Medicamento ya está desactivado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al desactivar el Almacen Medicamento.' });
    }
}


module.exports = { getAlmacenesMedicamentos,getAlmacenMedicamento, getAllAlmacenesMedicamentos, postAlmacenMedicamento, putAlmacenMedicamento, delAlmacenMedicamento };