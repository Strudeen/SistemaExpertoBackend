const { model, Schema } = require('mongoose');
const ComprasSchema = Schema({
   
    tipo: {
        type: String,
        enum: ['MENOR','MAYOR'],
        required: true,
    },

    medicamento: [{
        codigoMedicamento: {
            type: String,
            required: true,
        },
        cantidad: {
            type: Number,
            required: true,
        },
        documentos: [{
            documento: {
                type: DocumentosSchema,
                required: true,
            }, 
        }],
    }],
    state:{
        type:Boolean,
        default:true
    },

},{ timestamps: true });

module.exports = model('Compras', ComprasSchema);