const { model, Schema } = require('mongoose');
const AlmacenesSchema = Schema({
    _id: Schema.Types.ObjectId,
    codigoMedicamento: {
        type: String,
        required: true,
        unique: true,
    },
    cantidad: {
        type: Number,
        required: true,
    },
    state: {
        type: Boolean,
        default: true,
    },
    datos: [
        { type: Schema.Types.ObjectId, ref: 'AlmacenMedicamentos' }
    ]
}, { timestamps: true });

module.exports = model('Almacenes', AlmacenesSchema);