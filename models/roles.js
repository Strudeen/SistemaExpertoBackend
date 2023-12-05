const { model, Schema } = require('mongoose');
const RolesSchema = Schema({

    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    state: {
        type: Boolean,
        default: true
    },

}, { timestamps: true });

module.exports = model('Roles', RolesSchema);