const { response, request } = require('express');
const AlmacenMedicamento = require('../models/almacenMedicamentos');
const moment = require('moment');

const getAlertasAlmacen = async (req = request, res = response) => {
    try {
        const today = moment().startOf('day');
        const in30Days = moment().add(120, 'days').endOf('day');

        console.log('Fecha de hoy:', today.toDate());
        console.log('Fecha en 30 días:', in30Days.toDate());

        const expiringMedications = await AlmacenMedicamento.find({
            fechaCaducidad: {
                $gte: today.toDate(),
                $lte: in30Days.toDate(),
            },
            state: true
        }).populate('almacen');

        console.log('Medicamentos próximos a vencer:', expiringMedications);

        res.status(200).json(expiringMedications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener los medicamentos próximos a vencer.' });
    }
};

module.exports = { getAlertasAlmacen };