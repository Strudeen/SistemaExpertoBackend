const { model, Schema } = require('mongoose');
const InventarioMedicamentosSchema = Schema({
    
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
    cantidadInicial: {
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
    inventarios:{ type: Schema.Types.ObjectId, ref: 'Inventarios' }

}, { timestamps: true });

module.exports = model('InventarioMedicamentos', InventarioMedicamentosSchema);