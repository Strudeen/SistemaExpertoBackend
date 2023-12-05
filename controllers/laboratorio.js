const { response, request } = require('express');
const Laboratorio = require('../models/laboratorios');


const getLaboratorios = async (req = request, res = response) => {
    const laboratorios = await Laboratorio.find({});

    res.json(laboratorios);
}

const postLaboratorio = async (req = request, res = response) => {
    const { codigo, nombre, nit, telefono, celular, email, direccion, } = req.body;
    const laboratorio = new Laboratorio({
        codigo, nombre, nit, telefono, celular, email, direccion, state: true,
    })
    await laboratorio.save();
    res.status(201).json({
        msg: 'Laboratorio añadido exitosamente.',
        laboratorio,
    });
}

const putLaboratorio= async (req = request, res = response) => {
    const laboratorioId = req.params.id;
    const { codigo, nombre, nit, telefono, celular, email, direccion, } = req.body;

    try {

        const laboratorio = await Laboratorio.findById(laboratorioId);

        if (!laboratorio) {
            return res.status(404).json({ msg: 'Laboratorio no encontrado' });
        }

        laboratorio.codigo = codigo;
        laboratorio.nombre = nombre;
        laboratorio.nit = nit;
        laboratorio.telefono = telefono;
        laboratorio.celular = celular;
        laboratorio.email = email;
        laboratorio.direccion = direccion;



        await laboratorio.save();

        res.json({
            msg: 'Laboratorio actualizado exitosamente.',
            laboratorio,
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el laboratorio.' });
    }

}


const getLaboratorio = async (req = request, res = response) => {
    const laboratorioId = req.params.id

    const laboratorio = await Laboratorio.findById(laboratorioId);

    res.status(200).json(
        laboratorio
    );
}



const delLaboratorio = async (req = request, res = response) => {
    const laboratorioId = req.params.id;
    const { state } = req.body;

    try {
        const laboratorio = await Laboratorio.findById(laboratorioId);

        if (!laboratorio) {
            return res.status(404).json({ msg: 'Laboratorio no encontrado' });
        }

        laboratorio.state = state;

        await laboratorio.save();

        res.json({
            msg: 'Estado del laboratorio actualizado exitosamente.',
            laboratorio,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el estado del laboratorio.' });
    }
}


module.exports = { getLaboratorios, postLaboratorio, putLaboratorio, delLaboratorio, getLaboratorio };
