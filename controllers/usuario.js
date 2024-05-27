const { response, request } = require('express');
const Usuario = require('../models/usuarios');
const bcrypt = require('bcrypt');

const getUsuarios = async (req = request, res = response) => {
    const usuarios = await Usuario.find({});
    res.json(usuarios);
}

const postUsuario = async (req = request, res = response) => {
    const { nombre, apellido, email, password, rol, sexo, ci, } = req.body;

    const passhash = await bcrypt.hash(password, 10);

    const usuario = new Usuario({
        nombre, 
        apellido, 
        email, 
        password: passhash, 
        rol, 
        sexo, 
        ci, 
        state: true
    });

    await usuario.save();
    res.status(201).json({
        msg: 'Usuario añadido exitosamente.',
        usuario,
    });
}

const putUsuario = async (req = request, res = response) => {
    const usuarioId = req.params.id;
    const { nombre, apellido, email, password, rol, sexo, ci, } = req.body;

    try {
        const usuario = await Usuario.findById(usuarioId);

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        usuario.nombre = nombre;
        usuario.apellido = apellido;
        usuario.email = email;
       // usuario.password = password;
        usuario.rol = rol;
        usuario.sexo = sexo;
        usuario.ci = ci;


        await usuario.save();

        res.json({
            msg: 'Usuario actualizado exitosamente.',
            usuario,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el Usuario.' });
    }

}


const getUsuario = async (req = request, res = response) => {
    const usuarioId = req.params.id

    const usuario = await Usuario.findById(usuarioId);

    res.status(200).json(
        usuario
    );
}




const delUsuario = async (req = request, res = response) => {
    const usuarioId = req.params.id;
    const { state } = req.body;

    try {
        const usuario = await Usuario.findById(usuarioId);

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        usuario.state = state;

        await usuario.save();

        res.json({
            msg: 'Estado del usuario actualizado exitosamente.',
            usuario,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el estado del usuario.' });
    }
}


module.exports = { getUsuarios, postUsuario, putUsuario, getUsuario, delUsuario };
