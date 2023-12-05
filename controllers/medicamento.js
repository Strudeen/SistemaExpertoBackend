const { response, request } = require('express');
const Medicamento = require('../models/medicamentos');


const getMedicamentos = async (req = request, res = response) => {
    const medicamentos = await Medicamento.find({});
    console.log('prueba');
    res.json(medicamentos);
}

const postMedicamento = async (req = request, res = response) => {
    console.log('prueba');
    const { codigo, nombre, descripcion, tipo, exclusividad } = req.body;
    console.log('prueba2');
    console.log(req.body);
    

    try {
        const medicamento = new Medicamento({
            codigo, nombre, descripcion, tipo, exclusividad, state: true,
        })
        console.log('entro');
        await medicamento.save();
        res.status(201).json({
            msg: 'Medicamento añadido exitosamente.',
            medicamento,
        });
    } catch (error) {

        console.error(error);
        console.log('error');
        res.status(500).json({ msg: 'Error al añadir el medicamento.' });
    }

}

const putMedicamento = async (req = request, res = response) => {
    const medicamentoId = req.params.id;
    const { codigo, nombre, descripcion, tipo, exclusividad } = req.body;

    try {

        const medicamento = await Medicamento.findById(medicamentoId);

        if (!medicamento) {
            return res.status(404).json({ msg: 'Medicamento no encontrado' });
        }

        medicamento.codigo = codigo;
        medicamento.nombre = nombre;
        medicamento.descripcion = descripcion;
        medicamento.tipo = tipo;
        medicamento.exclusividad = exclusividad;


        await medicamento.save();

        res.json({
            msg: 'Medicamento actualizado exitosamente.',
            medicamento,
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el medicamento.' });
    }

}


const getMedicamento = async (req = request, res = response) => {
    const medicamentoId = req.params.id

    const medicamento = await Medicamento.findById(medicamentoId);

    res.status(200).json(
        medicamento
    );
}



const delMedicamento = async (req = request, res = response) => {
    const medicamentoId = req.params.id;
    const { state } = req.body;

    try {
        const medicamento = await Medicamento.findById(medicamentoId);

        if (!medicamento) {
            return res.status(404).json({ msg: 'Medicamento no encontrado' });
        }

        medicamento.state = state;

        await medicamento.save();

        res.json({
            msg: 'Estado del medicamento actualizado exitosamente.',
            medicamento,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el estado del medicamento.' });
    }
}





module.exports = { getMedicamentos, postMedicamento, putMedicamento, delMedicamento, getMedicamento };
