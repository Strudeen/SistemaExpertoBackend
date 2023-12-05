const { model, Schema } = require('mongoose');
const RecetasSchema = Schema({
    tipoReceta: {
        type: String,
        required: true
    },
    fechaReceta: {
        type: Date,
        required: true,
    },
    ciPaciente: {
        type: String,
        required: true,
    },
    diagnostico: [{
        tipoCancer: {
            type: String,
            required: true
        },
    }],
    diagnosticoMedicamentos: [{

        medicamentosEntregados: [{
            inventarioMedicamentoId: {
                type: String,
                required: true
            },
            cantidadMedicamentoEntregada: {
                type: Number,
                required: true
            }
        }],

        codigoMedicamento: {
            type: String,
            required: true,
        },
        cantidadSolicitada: {
            type: Number,
            required: true,
        },
        cantidadEntregada: {
            type: Number,
            reqiured: true,
        },
    }],

    fotoURL: {
        type: String,
        required: true,
    },
    state: {
        type: Boolean,
        default: true
    },

}, { timestamps: true });

module.exports = model('Recetas', RecetasSchema);