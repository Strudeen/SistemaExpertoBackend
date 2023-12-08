// models/pedido.js
const { model, Schema } = require('mongoose');

const PedidoSchema = new Schema({
    fechaPedido: {
        type: Date,
        required: true,
        default: Date.now
    },
    medicamentos: [{
        almacenMedicamentoId: String,
        codigoMedicamento: String,
        cantidadSolicitada: Number,
        cantidadEntregada: Number
    }],
    estado: {
        type: String,
        required: true,
        enum: ['pendiente', 'completado', 'cancelado'],
        default: 'pendiente'
    }
    // Aquí puedes agregar más campos según sea necesario
}, { timestamps: true });

module.exports = model('Pedido', PedidoSchema);
