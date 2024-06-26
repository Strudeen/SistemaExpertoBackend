const { Schema, model } = require('mongoose');

const RolesSchema = new Schema({
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
    permisos: [{
        permisoId: { type: Schema.Types.ObjectId, ref: 'Permisos' },
        estado: { type: Boolean, default: true }
    }]
}, { timestamps: true });

module.exports = model('Roles', RolesSchema);
