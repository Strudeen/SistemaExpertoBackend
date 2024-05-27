const { response, request } = require('express');
const Almacen = require('../models/almacenes');
const mongoose = require('mongoose');
const moment = require('moment');
const AlmacenMedicamento = require('../models/almacenMedicamentos');

const getReporteMesInventario = async (req = request, res = response) => {
    try {
        const { mesInicio, mesFinal, medicamentos } = req.body;
        const inicio = moment(mesInicio).startOf('day');
        const final = moment(mesFinal).endOf('day');

        const medicamentosList = await AlmacenMedicamento.find({
            updatedAt: {
                $gte: inicio,
                $lte: final,
            },
            almacen: {
                $in: medicamentos
            }
        });

        const groupedByAlmacen = {};

        medicamentosList.forEach(med => {
            const { almacen, cantidad, cantidadInicial } = med;

            if (!groupedByAlmacen[almacen]) {
                groupedByAlmacen[almacen] = { cantidad: 0, cantidadInicial: 0 };
            }

            groupedByAlmacen[almacen].cantidad += cantidad;
            groupedByAlmacen[almacen].cantidadInicial += cantidadInicial || 0;
        });

        res.status(200).json(groupedByAlmacen);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener los datos de los reportes.' });
    }
};

module.exports = { getReporteMesInventario };
module.exports = { getReporteMesInventario };