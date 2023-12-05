const { response, request } = require('express');
const Recetas = require('../models/recetas');
const Inventarios = require('../models/inventarios');
const InventarioMedicamentos = require('../models/inventarioMedicamentos');

const getRecetas = async (req = request, res = response) => {
    const recetas = await Recetas.find({});

    res.json(recetas);
}

const postReceta = async (req = request, res = response) => {


    const { tipoReceta, fechaReceta, ciPaciente, diagnostico, diagnosticoMedicamentos, fotoURL } = req.body;

    const recetas = new Recetas({
        tipoReceta,
        fechaReceta,
        ciPaciente,
        diagnostico,
        diagnosticoMedicamentos,
        fotoURL
    });

    try {
        //

        // Recorrer los medicamentos de la receta y actualizar el inventario
        for (const medicamentoReceta of diagnosticoMedicamentos) {
            const codigoMedicamento = medicamentoReceta.codigoMedicamento;
            let cantidadEntregada = medicamentoReceta.cantidadEntregada;
            let index = 0;

            // Buscar el medicamento en el inventario
            let inventarioMedicamento = await Inventarios.findOne({ codigoMedicamento }).populate('datos');
            if (inventarioMedicamento) {
                // Ordenar los datos por fechaCaducidad
                inventarioMedicamento.datos.sort((a, b) => a.fechaCaducidad - b.fechaCaducidad);

                // Restar la cantidad entregada y actualizar InventarioMedicamentos
                for (let dato of inventarioMedicamento.datos) {
                    let inventarioMedicamentoLista = await InventarioMedicamentos.findById(dato._id);
                    console.log('INVENTARIOLISTA', inventarioMedicamentoLista);
                    if (inventarioMedicamentoLista.cantidad >= cantidadEntregada) {
                        inventarioMedicamentoLista.cantidad -= cantidadEntregada;
                        recetas.diagnosticoMedicamentos[index].medicamentosEntregados.push({ inventarioMedicamentoId: inventarioMedicamentoLista._id, cantidadMedicamentoEntregada: cantidadEntregada });
                        console.log('DIAGNOSTICOMEDICAMENTOSMODIFICADOS', recetas.diagnosticoMedicamentos[index].medicamentosEntregados);
                        await inventarioMedicamentoLista.save();
                        break;
                    } else {
                        cantidadEntregada -= inventarioMedicamentoLista.cantidad;
                        recetas.diagnosticoMedicamentos[index].medicamentosEntregados.push({ inventarioMedicamentoId: inventarioMedicamentoLista._id, cantidadMedicamentoEntregada: inventarioMedicamentoLista.cantidad });
                        inventarioMedicamentoLista.cantidad = 0;
                        await inventarioMedicamentoLista.save();
                    }
                }

                // Calcular la nueva cantidad total en el inventario
                let cantidadTotal = 0;
                inventarioMedicamento = await Inventarios.findOne({ codigoMedicamento }).populate('datos');
                for (let dato of inventarioMedicamento.datos) {
                    cantidadTotal += dato.cantidad;
                }

                // Actualizar la cantidad en Inventarios
                inventarioMedicamento.cantidad = cantidadTotal;
                await inventarioMedicamento.save();
                index++;
            }
        }

        await recetas.save();
        res.json({ msg: 'postReceta', recetas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la receta' });
    }
}

// const { fechaReceta, ciPaciente, diagnostico,fotoURL, } = req.body;
// const receta = new Receta({
//     fechaReceta, ciPaciente, diagnostico,fotoURL, state: true,
// })
// await receta.save();
// for (const d of diagnostico) {
//     const inventario = await inventario.find({codigoMedicamento: d.codigoMedicamento});
//     let cantidad = d.cantidadEntregada;
//     let i=0;
//     while(cantidad > 0){
//         if(inventario[i].cantidad > cantidad){
//             inventario[i].cantidad -= cantidad;
//             cantidad = 0;
//         }else if(inventario[i].cantidad < cantidad){
//             cantidad -= inventario[i].cantidad;
//             inventario[i].cantidad = 0;
//         }
//         i++;
//     }
//     await inventario.save();
// }
// res.status(201).json({
//     msg: 'Receta añadida exitosamente.',
//     inventario,
// });


const putReceta = async (req = request, res = response) => {
    const idReceta = req.params.id;
    const { tipoReceta, fechaReceta, ciPaciente, diagnostico, diagnosticoMedicamentosModificados, fotoURL } = req.body;

    const recetas = new Recetas({
        tipoReceta,
        fechaReceta,
        ciPaciente,
        diagnostico,
        diagnosticoMedicamentos:diagnosticoMedicamentosModificados,
        fotoURL
    });

    try {
        // Encuentra la receta original por ID
        let recetaOriginal = await Recetas.findById(idReceta).populate({
            path: 'diagnosticoMedicamentos.medicamentosEntregados.inventarioMedicamentoId',
            model: 'InventarioMedicamentos'
        });

        if (!recetaOriginal) {
            return res.status(404).json({ error: 'Receta no encontrada' });
        }

        // Restaura las cantidades en InventarioMedicamentos
        for (const medicamentoOriginal of recetaOriginal.diagnosticoMedicamentos) {
            for (const medicamentoEntregado of medicamentoOriginal.medicamentosEntregados) {
                const inventarioMed = await InventarioMedicamentos.findById(medicamentoEntregado.inventarioMedicamentoId);
                console.log('INVENTARIOMED', inventarioMed);
                inventarioMed.cantidad += medicamentoEntregado.cantidadMedicamentoEntregada;
                await inventarioMed.save();
            }
        }

        // Actualiza las cantidades con los nuevos datos
        for (const medicamentoReceta of diagnosticoMedicamentosModificados) {
            const codigoMedicamento = medicamentoReceta.codigoMedicamento;
            let cantidadEntregada = medicamentoReceta.cantidadEntregada;
            let index = 0;
           
            // Buscar el medicamento en el inventario
            let inventarioMedicamento = await Inventarios.findOne({ codigoMedicamento }).populate('datos');
            if (inventarioMedicamento) {
                // Ordenar los datos por fechaCaducidad
                inventarioMedicamento.datos.sort((a, b) => a.fechaCaducidad - b.fechaCaducidad);

                // Restar la cantidad entregada y actualizar InventarioMedicamentos
                for (let dato of inventarioMedicamento.datos) {
                    const inventarioMedicamentoLista = await InventarioMedicamentos.findById(dato._id);
            
                    console.log('INVENTARIOMEDICAMENTOLISTA_ID', inventarioMedicamentoLista);
                    if (inventarioMedicamentoLista.cantidad >= cantidadEntregada) {
                        inventarioMedicamentoLista.cantidad -= cantidadEntregada;
                        recetas.diagnosticoMedicamentos[index].medicamentosEntregados.push({ inventarioMedicamentoId: inventarioMedicamentoLista._id, cantidadMedicamentoEntregada: cantidadEntregada });
                        console.log('DIAGNOSTICOMEDICAMENTOSMODIFICADOS',  recetas.diagnosticoMedicamentos[index]);
                        console.log('DIAGNOSTICOMEDICAMENTOSMODIFICADOS',  recetas.diagnosticoMedicamentos[index].medicamentosEntregados);
                        await inventarioMedicamentoLista.save();
                        break;
                    } else {
                        cantidadEntregada -= inventarioMedicamentoLista.cantidad;
                        recetas.diagnosticoMedicamentos[index].medicamentosEntregados.push({ inventarioMedicamentoId: inventarioMedicamentoLista._id, cantidadMedicamentoEntregada: inventarioMedicamentoLista.cantidad });
                        console.log('DIAGNOSTICOMEDICAMENTOSMODIFICADOS',  recetas.diagnosticoMedicamentos[index]);
                        console.log('DIAGNOSTICOMEDICAMENTOSMODIFICADOS',  recetas.diagnosticoMedicamentos[index].medicamentosEntregados);
                        inventarioMedicamentoLista.cantidad = 0;
                        
                        await inventarioMedicamentoLista.save();
                    }
                }

                // Calcular la nueva cantidad total en el inventario
                let cantidadTotal = 0;
                inventarioMedicamento = await Inventarios.findOne({ codigoMedicamento }).populate('datos');
                for (let dato of inventarioMedicamento.datos) {
                    cantidadTotal += dato.cantidad;
                    console.log('CANTIDAD TOTAL',cantidadTotal);
                }

                // Actualizar la cantidad en Inventarios
                inventarioMedicamento.cantidad = cantidadTotal;
                await inventarioMedicamento.save();
                index++;
            }
        }

        // Guarda los cambios en la receta
        recetaOriginal.tipoReceta = recetas.tipoReceta;
        recetaOriginal.fechaReceta = recetas.fechaReceta;
        recetaOriginal.ciPaciente = recetas.ciPaciente;
        recetaOriginal.diagnostico = recetas.diagnostico;
        recetaOriginal.diagnosticoMedicamentos = recetas.diagnosticoMedicamentos;
        recetaOriginal.fotoURL = recetas.fotoURL;
        
        console.log("RECETAORIGINAL",recetaOriginal);
        console.log("RECETAORIGINALDIAGNOSTICO",recetaOriginal.diagnosticoMedicamentos);
        console.log("RECETAORIGINAMEDICAMENTOS",recetaOriginal.diagnosticoMedicamentos[0].medicamentosEntregados);
        await recetaOriginal.save();
        console.log(recetaOriginal)

        res.json({ msg: 'Receta actualizada', receta: recetaOriginal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
}


const getDocumento = async (req = request, res = response) => {
    const documentoId = req.params.id

    const documento = await Documento.findById(documentoId);

    res.status(200).json(
        documento
    );
}



const delDocumento = async (req = request, res = response) => {
    const documentoId = req.params.id;
    const { state } = req.body;

    try {
        const documento = await Inventario.findById(medicamentoId);

        if (!documento) {
            return res.status(404).json({ msg: 'Documento no encontrado' });
        }

        documento.state = state;

        await documento.save();

        res.json({
            msg: 'Estado del documento actualizado exitosamente.',
            documento,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el estado del documento.' });
    }
}


module.exports = { getRecetas, postReceta, putReceta, delDocumento, getDocumento };
