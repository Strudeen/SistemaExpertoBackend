const { model, Schema } = require('mongoose');
const LaboratorioSchema = Schema({
    codigo: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    nit: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: false
    },
    celular: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

module.exports = model('Laboratorios', LaboratorioSchema);