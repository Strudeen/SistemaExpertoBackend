const { model, Schema } = require('mongoose');
const DocumentosSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    validacion: {
        type: Boolean,
        required: true,
    },
    fotoURL: {
        type: String,
        required: true,
    },
    state: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

module.exports = model('Documentos', DocumentosSchema);