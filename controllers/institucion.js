const { response, request } = require('express');
const Institucion = require('../models/institucion'); // Ajusta la ruta según sea necesario


const getInstitucion = async (req, res) => {
    try {
        const instituciones = await Institucion.find({ deleted: false });
        res.json(instituciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener instituciones' });
    }
};


const getInst = async (req = request, res = response) => {
    const institucionId = req.params.id
    try {
        const institucion = await Institucion.findById(institucionId);

        res.status(200).json(
            institucion
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la institucion' });
    }
}


// Crear una nueva institución
const postInstitucion = async (req, res) => {
    try {
        const {
            institucionPrincipal,
            institucionNombre,
            institucionDetalles,
            institucionDescripcion,
            institucionDireccion,
            institucionNit,
            institucionEmail,
            institucionFax,
            institucionTelefono,
            institucionCelular,
        } = req.body;

        const nuevaInstitucion = new Institucion({
            institucionPrincipal,
            institucionNombre,
            institucionDetalles,
            institucionDescripcion,
            institucionDireccion,
            institucionNit,
            institucionEmail,
            institucionFax,
            institucionTelefono,
            institucionCelular,
        });

        const institucion = await nuevaInstitucion.save();
        res.json({ msg: 'Institución creada', institucion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la institución' });
    }
};


// Actualizar una institución
const putInstitucion = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            institucionPrincipal,
            institucionNombre,
            institucionDetalles,
            institucionDescripcion,
            institucionDireccion,
            institucionNit,
            institucionEmail,
            institucionFax,
            institucionTelefono,
            institucionCelular,
        } = req.body;

        const institucionPath = '/home/serviciosNuclearesDocumentos/documentosPublico/imagenes';

        const institucionActualizada = await Institucion.findByIdAndUpdate(
            id,
            {
                institucionPrincipal,
                institucionNombre,
                institucionDetalles,
                institucionDescripcion,
                institucionDireccion,
                institucionNit,
                institucionEmail,
                institucionFax,
                institucionTelefono,
                institucionCelular,

            },
            { new: true } // Retorna el documento actualizado
        );

        if (!institucionActualizada) {
            return res.status(404).json({ error: 'Institución no encontrada' });
        }

        res.json({ msg: 'Institución actualizada', institucionActualizada });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la institución' });
    }
};

module.exports = { getInstitucion, getInst ,putInstitucion, postInstitucion };