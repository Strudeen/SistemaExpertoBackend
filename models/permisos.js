const { Schema, model } = require('mongoose');

const PermisosSchema = new Schema({
    _id: Schema.Types.ObjectId,
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
    roles: [{
        roleId: { type: Schema.Types.ObjectId, ref: 'Roles' },
        estado: { type: Boolean, default: true }
    }]
}, { timestamps: true });

module.exports = model('Permisos', PermisosSchema);
