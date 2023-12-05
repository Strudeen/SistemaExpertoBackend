const { model, Schema } = require('mongoose');
const AlmacenMedicamentoSchema = Schema({
    
    _id: Schema.Types.ObjectId,
    fechaCaducidad: {
        type: Date,
        required: true,
    },
    codigoLaboratorio: {
        type: String,
        required: true,
    },
    cantidad: {
        type: Number,
        required: true,
    },
    nroLote: {
        type: String,
        required: true,
    },
    state: {
        type: Boolean,
        default: true
    },
    almacen:{ type: Schema.Types.ObjectId, ref: 'Almacenes' }

}, { timestamps: true });

module.exports = model('AlmacenMedicamentos', AlmacenMedicamentoSchema);