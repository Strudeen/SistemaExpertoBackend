const { model, Schema } = require('mongoose');

const ComprasSchema = Schema({

    tipo: {
        type: String,
        enum: ['MENOR', 'MAYOR'],
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
    precioTotal: {
        type: String,
        required: true,
    },
    nombreEmpresa: {
        type: String,
        required: true,
    },
    documentos: [{
        fotoURL: {
            type: String,
            required: true,
        },
        state: {
            type: Boolean,
            default: false
        },
    }],
    medicamento: [{
        codigoMedicamento: {
            type: String,
            required: true,
        },
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
        precioUnitario: {
            type: Number,
            required: true,
        },
        nroLote: {
            type: String,
            required: true,
        },
        idMedicamentoAlmacen: {
            type: String,
            required: true,
        },
    }],
    state: {
        type: Boolean,
        default: true
    },

}, { timestamps: true });

module.exports = model('Compras', ComprasSchema);