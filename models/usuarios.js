
const { model, Schema } = require('mongoose');
const UsuariosSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellido:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    rol: {
        type: String,
        required: true,
    },
    sexo: {
        type: String,
        required: true,
    },
    ci: {
        type: String,
        requierd: true,
    },
    state: {
        type: Boolean,
        default: true
    },

}, { timestamps: true });

module.exports = model('Usuarios', UsuariosSchema);