// controllers/pedidosController.js
const Pedido = require('../models/pedidos');
const mongoose = require('mongoose');
const Almacenes = require('../models/almacenes');
const AlmacenMedicamentos = require('../models/almacenMedicamentos');
const Inventarios = require('../models/inventarios');
const InventarioMedicamentos = require('../models/inventarioMedicamentos');

const verPedidos = async (req, res) => {
    try {
        // Puedes agregar filtros según sea necesario
        const pedidos = await Pedido.find({}); 
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los pedidos", error: error.message });
    }
};


const actualizarEstadoPedido = async (req, res) => {
    const { id } = req.params; // ID del pedido
    const { nuevoEstado } = req.body; // Nuevo estado del pedido

    try {
        const pedido = await Pedido.findById(id);
        if (!pedido) {
            return res.status(404).json({ mensaje: "Pedido no encontrado" });
        }

        // Actualiza el estado del pedido
        pedido.estado = nuevoEstado;
        await pedido.save();

        // Si el pedido se completa, añadir a inventario
        console.log('PEDIDO MEDICAMENTOS', pedido.medicamentos);
        if (nuevoEstado === 'completado') {
            for (let medicamento of pedido.medicamentos) {
                const { codigoMedicamento, cantidadEntregada } = medicamento;
              
                // Obtener detalles adicionales del medicamento desde el almacén o una fuente externa
                const detallesMedicamento = await AlmacenMedicamentos.findOne({ _id: medicamento.almacenMedicamentoId }).sort({ fechaCaducidad: 1 }); // Ejemplo: obtener el lote más próximo a caducar
        
                let inventario = await Inventarios.findOne({ codigoMedicamento });
                if (!inventario) {
                    inventario = new Inventarios({
                        _id: new mongoose.Types.ObjectId(),
                        codigoMedicamento,
                        cantidad: cantidadEntregada,
                        datos: []
                    });
                } else {
                    inventario.cantidad += cantidadEntregada;
                }
        
                // Crear un nuevo lote en InventarioMedicamentos
                const nuevoInventarioMedicamento = new InventarioMedicamentos({
                    _id: new mongoose.Types.ObjectId(),
                    fechaCaducidad: detallesMedicamento.fechaCaducidad,
                    codigoLaboratorio: detallesMedicamento.codigoLaboratorio,
                    cantidad: cantidadEntregada,
                    cantidadInicial: cantidadEntregada,
                    nroLote: detallesMedicamento.nroLote,
                    state: true,
                    inventarios: inventario._id
                });

                console.log(' NUEVO INVENTARIO MEDICAMENTO', nuevoInventarioMedicamento);
                await nuevoInventarioMedicamento.save();
        
                inventario.datos.push(nuevoInventarioMedicamento._id);
       
                await inventario.save();
            }
        }
        

        // Si el pedido se cancela, revertir las cantidades (similar a cancelarPedido)
        if (nuevoEstado === 'cancelado') {
            // La lógica para cancelar un pedido ya implementada en tu función anterior
        }

        res.json({ mensaje: "Pedido actualizado con éxito", pedido });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el pedido", error: error.message });
    }
};




// const actualizarEstadoPedido = async (req, res) => {
//     const { id } = req.params; // ID del pedido
//     const { nuevoEstado } = req.body; // Nuevo estado del pedido

//     try {
//         const pedido = await Pedido.findById(id);
//         if (!pedido) {
//             return res.status(404).json({ mensaje: "Pedido no encontrado" });
//         }

//         Actualiza el estado del pedido
//         pedido.estado = nuevoEstado;
//         await pedido.save();

//         Si el pedido se completa, añadir a inventario
//         if (nuevoEstado === 'completado') {
//             for (const medicamento of pedido.medicamentos) {
                
//                 const { codigoMedicamento, cantidadEntregada } = medicamento;

//                 await Inventarios.findOneAndUpdate(
//                     { codigoMedicamento },
//                     { $inc: { cantidad: cantidadEntregada } }
//                 );
//             }
//         }

//         Si el pedido se cancela, revertir las cantidades (similar a cancelarPedido)
//         if (nuevoEstado === 'cancelado') {
//             for (const medicamento of pedido.medicamentos) {
//                 const { codigoMedicamento, cantidadSolicitada } = medicamento;
//                 await Almacenes.findOneAndUpdate(
//                     { codigoMedicamento },
//                     { $inc: { cantidad: cantidadSolicitada } }
//                 );
//             }
//         }

//         res.json({ mensaje: "Pedido actualizado con éxito", pedido });
//     } catch (error) {
//         res.status(500).json({ mensaje: "Error al actualizar el pedido", error: error.message });
//     }
// };

module.exports = { verPedidos, actualizarEstadoPedido };