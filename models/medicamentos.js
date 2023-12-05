const { model, Schema } = require('mongoose');
const MedicamentosSchema = Schema({
    codigo: {
        type: String,
        required: true,
        unique: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    tipo: {
        type: String,
        requierd: true,
    },
    exclusividad: {
        type: Boolean,
        required: true,
    },
    state: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

module.exports = model('Medicamentos', MedicamentosSchema);