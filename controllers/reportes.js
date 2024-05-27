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
            // almacen: {
            //     $in: medicamentos
            // }
        }).populate('almacen');

       

        const groupedByAlmacen = medicamentosList.reduce((acc, item) => {
            const { almacen, cantidad, cantidadInicial } = item;
            acc[almacen.codigoMedicamento] = acc[almacen.codigoMedicamento] || { cantidad: 0, cantidadInicial: 0 };
            acc[almacen.codigoMedicamento].cantidad += cantidad;
            acc[almacen.codigoMedicamento].cantidadInicial += cantidadInicial;
            return acc;
          }, {});
          
          const formattedArray = Object.entries(groupedByAlmacen).map(([almacen, { cantidad, cantidadInicial, codigoMedicamento }]) => (
            {
              cantidad,
              cantidadInicial,
              codigoMedicamento: almacen,
            }
          ));

        res.status(200).json(formattedArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener los datos de los reportes.' });
    }
};

module.exports = { getReporteMesInventario };
module.exports = { getReporteMesInventario };