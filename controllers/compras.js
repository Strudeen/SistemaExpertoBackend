const { response, request } = require('express');
const Compras = require('../models/compras');
const AlmacenMedicamento = require('../models/almacenMedicamentos');
const Almacen = require('../models/almacenes');
const mongoose = require('mongoose');


// Obtener todas las compras
const getCompras = async (req = request, res = response) => {
    console.log("afasdf")
    try {
        const compras = await Compras.find();
        res.json(compras);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Obtener una compra por su ID
const getCompra = async (req = request, res = response) => {
    try {
        const compra = await Compras.findById(req.params.id);
        if (!compra) return res.status(404).json({ message: 'Compra no encontrada' });
        res.json(compra);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Crear una nueva compra
const postCompra = async (req = request, res = response) => {
    let { tipo, documentos, medicamento, fecha, nombreEmpresa } = req.body;
    let precioTotal = 0;
    let index = 0;
    for (med of medicamento) {
        
        let almacen = await Almacen.findOne({ codigoMedicamento: med.codigoMedicamento });

        if (!almacen) {
            const newAlmacen = new Almacen({
                codigoMedicamento: med.codigoMedicamento,
                cantidad: parseInt(med.cantidad),
                state: true,
                _id: new mongoose.Types.ObjectId(),
            });
            almacen = await newAlmacen.save();
        } else {
            almacen.cantidad = parseInt(almacen.cantidad) + parseInt(med.cantidad);
        }

        const newAlmacenMedicamento = new AlmacenMedicamento({
            fechaCaducidad: med.fechaCaducidad,
            codigoLaboratorio: med.codigoLaboratorio,
            cantidad: med.cantidad,
            cantidadInicial: med.cantidad,
            nroLote: med.nroLote,
            state: true,
            almacen: almacen._id,
            _id: new mongoose.Types.ObjectId(),
        });
        almacen.datos.push(newAlmacenMedicamento._id);
        precioTotal += parseInt(med.cantidad) * parseFloat(med.precioUnitario);
        medicamento[index].idMedicamentoAlmacen = newAlmacenMedicamento._id;
        await newAlmacenMedicamento.save();
        await almacen.save();
        console.log("NEW-ALMACEN", newAlmacenMedicamento);
        console.log("ALMACEN", almacen);
        index++;

    };
    const compra = new Compras({
        tipo,
        documentos,
        medicamento,
        fecha,
        precioTotal,
        nombreEmpresa
    });
    console.log(compra);
    try {
        const newCompra = await compra.save();
        res.status(201).json(newCompra);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Actualizar una compra por su ID
const putCompra = async (req = request, res = response) => {
    const { tipo, documentos, medicamento, state } = req.body;
    try {
        const compra = await Compras.findByIdAndUpdate(req.params.id, { tipo, documentos, medicamento, state });
        if (!compra) return res.status(404).json({ message: 'Compra no encontrada' });
        res.json(compra);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const deleteCompra = async (req, res) => {
    const { id } = req.params; // ID de la compra a revertir
    console.log(id);
    try {
        const compra = await Compras.findById(id);
        if (!compra || !compra.state) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }

        for (const med of compra.medicamento) {
            // Encontrar el documento correspondiente en AlmacenMedicamento
            let almacenMed = await AlmacenMedicamento.findById(med.idMedicamentoAlmacen);
            console.log(almacenMed)
            if (almacenMed) {
                almacenMed.cantidad = 0;
                almacenMed.state = false;
                await almacenMed.save();
            }

            // Actualizar la cantidad en Almacen
            let almacen = await Almacen.findOne({ codigoMedicamento: med.codigoMedicamento });
            if (almacen) {
                almacen.cantidad -= med.cantidad; // Asegúrate de que la cantidad no sea negativa
                await almacen.save();
            }
        }

        // Opcional: Actualizar el estado de la compra
        compra.state = false; // Suponiendo que hay un campo 'state' en el modelo Compras
        await compra.save();

        res.status(200).json({ message: "Compra revertida con éxito" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getCompras, getCompra, postCompra, putCompra, deleteCompra };