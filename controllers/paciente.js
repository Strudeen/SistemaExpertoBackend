const { response, request } = require('express');
const Paciente = require('../models/pacientes');

const getPacientes = async (req = request, res = response) => {
    const pacientes = await Paciente.find({});
    res.json(pacientes);
}

const postPaciente = async (req = request, res = response) => {
    const { nombre, apellido, fechaNacimiento, domicilio, sexo ,ci, edad } = req.body;
    const paciente = new Paciente({
        nombre, apellido, fechaNacimiento, domicilio, sexo ,ci, edad, state: true
    });

    await paciente.save();
    res.status(201).json({
        msg: 'Paciente añadido exitosamente.',
        paciente: paciente,
    });
}

const putPaciente = async (req = request, res = response) => {
    const pacienteId = req.params.id;
    const {
        nombre,
        apellido,
        ci,
        edad } = req.body;

    try {
        // Buscar el elemento por ID
        const paciente = await Paciente.findById(pacienteId);

        if (!paciente) {
            return res.status(404).json({ msg: 'Paciente no encontrado' });
        }

        paciente.nombre = nombre;
        paciente.apellido = apellido;
        paciente.ci = ci;
        paciente.edad = edad;

        // Guardar los cambios
        await paciente.save();

        res.json({
            msg: 'Paciente actualizado exitosamente.',
            paciente: paciente,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el Paciente.' });
    }

}


const getPaciente = async (req = request, res = response) => {
    const pacienteId = req.params.id

    const paciente = await Paciente.findById(pacienteId);

    res.status(200).json(
        paciente
    );
}




const delPaciente = async (req = request, res = response) => {
    const pacienteId = req.params.id;
    const { state } = req.body;

    try {
        const paciente = await Paciente.findById(pacienteId);

        if (!paciente) {
            return res.status(404).json({ msg: 'Paciente no encontrado' });
        }

        paciente.state = state;

        await paciente.save();

        res.json({
            msg: 'Estado del paciente actualizado exitosamente.',
            item: paciente,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el estado del paciente.' });
    }
}


module.exports = { getPacientes, postPaciente, putPaciente, delPaciente, getPaciente };
