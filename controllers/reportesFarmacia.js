const { response, request } = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const InventarioMedicamento = require('../models/inventarioMedicamentos');

const getReporteMesFarmacia = async (req = request, res = response) => {
    try {
        const { mesInicio, mesFinal, medicamentos } = req.body;
        const inicio = moment(mesInicio).startOf('day');
        const final = moment(mesFinal).endOf('day');

        const medicamentosList = await InventarioMedicamento.find({
            updatedAt: {
                $gte: inicio,
                $lte: final,
            },
            // almacen: {
            //     $in: medicamentos
            // }
        }).populate('inventarios');

       

        const groupedByInventarios = medicamentosList.reduce((acc, item) => {
            const { inventarios, cantidad, cantidadInicial } = item;
            acc[inventarios.codigoMedicamento] = acc[inventarios.codigoMedicamento] || { cantidad: 0, cantidadInicial: 0 };
            acc[inventarios.codigoMedicamento].cantidad += cantidad;
            acc[inventarios.codigoMedicamento].cantidadInicial += cantidadInicial;
            return acc;
          }, {});
          
          const formattedArray = Object.entries(groupedByInventarios).map(([inventarios, { cantidad, cantidadInicial, codigoMedicamento }]) => (
            {
              cantidad,
              cantidadInicial,
              codigoMedicamento: inventarios,
            }
          ));

        res.status(200).json(formattedArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener los datos de los reportes.' });
    }
};

module.exports = { getReporteMesFarmacia };