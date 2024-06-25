const { model, Schema } = require('mongoose');
const InsitucionSchema = Schema({
    
    institucionPrincipal: {
        type: String,
        required: true,
    },
    institucionNombre: {
        type: String,
        required: true,
    },
    institucionDetalles: {
        type: String,
        required: true,
    },
    institucionDescripcion: {
        type: String,
        required: true, 
    },
    institucionDireccion: {
        type: String,
        required: true,
    },
    institucionNit: {
        type: String,
        required: true,
    },
    institucionEmail: {
        type: String,
        required: true,
    },
    institucionFax: {
        type: String,
        requierd: false,
    },
    institucionTelefono: {
        type: String,
        required: true,
  
    },
    institucionCelular: {
        type: String,
        required: true,

    },
}, { timestamps: true });

module.exports = model('Institucion', InsitucionSchema);