const { response, request } = require('express');
const Usuario = require('../models/usuarios');
const bcrypt = require('bcrypt');

const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
  return regex.test(password);
};

const getUsuarios = async (req = request, res = response) => {
  const usuarios = await Usuario.find({});
  res.json(usuarios);
}

const postUsuario = async (req = request, res = response) => {
  const { nombre, apellido, email, password, rol, sexo, ci } = req.body;

  // Validar la contraseña
  if (!validatePassword(password)) {
    return res.status(400).json({
      msg: 'La contraseña debe tener entre 8 y 12 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.'
    });
  }

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
  const { nombre, apellido, email, password, rol, sexo, ci } = req.body;

  try {
    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.email = email;
    // usuario.password = password; // Omitimos actualizar la contraseña aquí
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
  const usuarioId = req.params.id;

  const usuario = await Usuario.findById(usuarioId);

  res.status(200).json(usuario);
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

const putUsuarioPassword = async (req = request, res = response) => {
  const usuarioId = req.params.id;
  const { password } = req.body;

  try {
    // Buscar el usuario por ID
    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Validar la nueva contraseña
    if (!validatePassword(password)) {
      return res.status(400).json({
        msg: 'La contraseña debe tener entre 8 y 12 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.'
      });
    }

    // Cifrar la nueva contraseña
    const passhash = await bcrypt.hash(password, 10);

    // Actualizar la contraseña del usuario
    usuario.password = passhash;

    // Guardar los cambios
    await usuario.save();

    res.json({
      msg: 'Contraseña actualizada exitosamente.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar la contraseña del usuario.' });
  }
}

module.exports = { getUsuarios, postUsuario, putUsuario, getUsuario, delUsuario, putUsuarioPassword };
