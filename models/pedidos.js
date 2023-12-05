const { model, Schema } = require('mongoose');
const PedidosSchema = Schema({

    medicamento: [{
        _id: false,

        codigoMedicamento: {
            type: String,
            required: true,
        },
        cantidad: {
            type: Number,
            required: true,
        }

    }],
    estado: {
        type: Number,
        required: true,
    },
    state: {
        type: Boolean,
        default: true
    },

}, { timestamps: true });

module.exports = model('Pedidos', PedidosSchema);