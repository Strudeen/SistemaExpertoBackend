const { model, Schema } = require('mongoose');
const PacientesSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    domicilio: {
        type: String  
    },
    fechaNacimiento: {
        type: Date
    },
    sexo: {
        type: Boolean
    },
    ci: {
        type: String,
        required: true,
        unique: true,
    },
    edad: {
        type: String,
        requierd: true,
    },
    state: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

module.exports = model('Pacientes', PacientesSchema);