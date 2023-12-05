const { response, request } = require('express');
const Rol = require('../models/roles');

const getRoles = async (req = request, res = response) => {
    const roles = await Rol.find({});
    res.json(roles);
}

const postRol = async (req = request, res = response) => {
    const { nombre, descripcion, } = req.body;
    const rol = new Rol({
        nombre, descripcion, state: true,
    });

    await rol.save();
    res.status(201).json({
        msg: 'Rol añadido exitosamente.',
        rol,
    });
}

const putRol = async (req = request, res = response) => {
    const rolId = req.params.id;
    const { nombre, descripcion, } = req.body;

    try {
        const rol = await Rol.findById(rolId);

        if (!rol) {
            return res.status(404).json({ msg: 'Rol no encontrado' });
        }

        rol.nombre = nombre;
        rol.descripcion = descripcion;


        await rol.save();

        res.json({
            msg: 'Rol actualizado exitosamente.',
            rol,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el Rol.' });
    }

}


const getRol = async (req = request, res = response) => {
    const rolId = req.params.id

    const rol = await Rol.findById(rolId);

    res.status(200).json(
        rol
    );
}




const delRol = async (req = request, res = response) => {
    const rolId = req.params.id;
    const { state } = req.body;

    try {
        const rol = await Rol.findById(rolId);

        if (!rol) {
            return res.status(404).json({ msg: 'Rol no encontrado' });
        }

        rol.state = state;

        await rol.save();

        res.json({
            msg: 'Estado del rol actualizado exitosamente.',
            rol,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el estado del rol.' });
    }
}


module.exports = { getRoles, postRol, putRol, getRol, delRol };
