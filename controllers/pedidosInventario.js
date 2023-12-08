// controllers/pedidosController.js
const Pedido = require('../models/pedidos');
const Almacenes = require('../models/almacenes');
const AlmacenMedicamentos = require('../models/almacenMedicamentos');
const Inventarios = require('../models/inventarios');


const crearPedido = async (req, res) => {
    const { medicamentos } = req.body;

    try {
        const detallesPedido = await Promise.all(medicamentos.map(async (medicamento) => {
            const { codigoMedicamento, cantidadSolicitada } = medicamento;
            let cantidadRestante = cantidadSolicitada;

            // Buscar el medicamento en el almacén
            const itemAlmacen = await Almacenes.findOne({ codigoMedicamento }).populate('datos');
            if (!itemAlmacen || itemAlmacen.cantidad < cantidadSolicitada) {
                throw new Error(`No hay suficiente stock de ${codigoMedicamento} en el almacén`);
            }

            // Restar la cantidad solicitada del total en Almacenes
            itemAlmacen.cantidad -= cantidadSolicitada;
            await itemAlmacen.save();

            // Ordenar los datos por fechaCaducidad y restar de AlmacenMedicamentos
            itemAlmacen.datos.sort((a, b) => a.fechaCaducidad - b.fechaCaducidad);
            let arrayvacio = {};
            for (let dato of itemAlmacen.datos) {
                let almacenMedicamento = await AlmacenMedicamentos.findById(dato._id);
                if (almacenMedicamento.cantidad >= cantidadRestante) {
                    almacenMedicamento.cantidad -= cantidadRestante;
                    await almacenMedicamento.save();
                    arrayvacio = {
                        almacenMedicamentoId: almacenMedicamento._id,
                        codigoMedicamento,
                        cantidadSolicitada,
                        cantidadEntregada: cantidadSolicitada
                    };
                    break;
                } else {
                    cantidadRestante -= almacenMedicamento.cantidad;
                    almacenMedicamento.cantidad = 0;
                    await almacenMedicamento.save();
                }

                arrayvacio = {
                    almacenMedicamentoId: almacenMedicamento._id,
                    codigoMedicamento,
                    cantidadSolicitada,
                    cantidadEntregada: cantidadSolicitada
                };

            }

            return arrayvacio;

        }));

        // Crear un nuevo pedido con los detalles verificados
        const nuevoPedido = new Pedido({
            medicamentos: detallesPedido,
            estado: 'pendiente'
        });
        console.log('DETALLESPEDIDO', detallesPedido);
        console.log('NUEVOMEDICAMENTO', nuevoPedido.medicamentos);

        await nuevoPedido.save();
        res.status(201).json({ mensaje: "Pedido creado exitosamente", pedido: nuevoPedido });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el pedido", error: error.message });
    }
};



// const crearPedido = async (req, res) => {
//     const { medicamentos } = req.body; 
//     try {
//         // Verificar disponibilidad en el almacén y preparar los detalles del pedido
//         const detallesPedido = await Promise.all(medicamentos.map(async (medicamento) => {
//             const { codigoMedicamento, cantidadSolicitada } = medicamento;
//             console.log(medicamento);
//             // Verificar disponibilidad en el almacén

//             const itemAlmacen = await Almacenes.findOne({ codigoMedicamento });
//             console.log('ITEM ALMACEN',itemAlmacen);
//             if (!itemAlmacen || itemAlmacen.cantidad < cantidadSolicitada) {
//                 console.log('CANTIDAD IF',itemAlmacen.cantidad);
//                 throw new Error(`No hay suficiente stock de ${codigoMedicamento} en el almacén`);
//             }

//             // Restar la cantidad solicitada del almacén (pero no guardar todavía)
//             itemAlmacen.cantidad -= cantidadSolicitada;
//             console.log('CANTIDAD FUERA IF ', itemAlmacen.cantidad);

//             return {
//                 codigoMedicamento,
//                 cantidadSolicitada,
//                 cantidadEntregada: cantidadSolicitada // Asumimos que toda la cantidad solicitada se entregará
//             };
//         }));

//         // Crear un nuevo pedido con los detalles verificados
//         const nuevoPedido = new Pedido({
//             medicamentos: detallesPedido,
//             estado: 'pendiente'
//         });

//         // Guardar el pedido y los cambios en el almacén
//         await nuevoPedido.save();
//         await Promise.all(detallesPedido.map(async (detalle) => {
//             const { codigoMedicamento, cantidadSolicitada } = detalle;
//             await Almacenes.findOneAndUpdate({ codigoMedicamento }, { $inc: { cantidad: -cantidadSolicitada } });
//         }));

//         res.status(201).json({ mensaje: "Pedido creado exitosamente", pedido: nuevoPedido });
//     } catch (error) {
//         res.status(500).json({ mensaje: "Error al crear el pedido", error: error.message });
//     }
// };

// Método obtenerPedidos
const obtenerPedidos = async (req, res) => {
    try {
        // Obtener todos los pedidos. Puedes modificar la consulta para filtrar por estado, fecha, etc.
        const pedidos = await Pedido.find({}).populate('medicamentos.codigoMedicamento'); // El método populate() es opcional y depende de cómo quieras presentar los datos

        // Enviar respuesta con los pedidos
        res.json(pedidos);
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ mensaje: "Error al obtener los pedidos", error: error.message });
    }
};

const obtenerPedido = async (req, res) => {
    const { id } = req.params; // ID del pedido a obtener

    try {
        // Buscar el pedido por su ID
        const pedido = await Pedido.findById(id);

        // Verificar si el pedido existe
        if (!pedido) {
            return res.status(404).json({ mensaje: "Pedido no encontrado" });
        }

        // Enviar el pedido encontrado como respuesta
        res.json(pedido);
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ mensaje: "Error al obtener el pedido", error: error.message });
    }
};

const cancelarPedido = async (req, res) => {
    const { id } = req.params; // ID del pedido a cancelar

    try {
        // Buscar el pedido por ID
        const pedido = await Pedido.findById(id).populate('medicamentos.codigoMedicamento');
        if (!pedido) {
            return res.status(404).json({ mensaje: "Pedido no encontrado" });
        }

        // Verificar si el pedido puede ser cancelado
        if (pedido.estado !== 'pendiente') {
            return res.status(400).json({ mensaje: "Solo se pueden cancelar pedidos que estén pendientes" });
        }

        // Procesar cada medicamento en el pedido para revertir las cantidades en el almacén
        for (const medicamento of pedido.medicamentos) {
            const { codigoMedicamento, cantidadEntregada } = medicamento;

            // Revertir la cantidad reservada en el almacén
            const itemAlmacen = await Almacenes.findOne({ codigoMedicamento }).populate('datos');
            if (itemAlmacen) {
                itemAlmacen.cantidad += cantidadEntregada;
                await itemAlmacen.save();

                // Revertir las cantidades en AlmacenMedicamentos
                let cantidadRestante = cantidadEntregada;
                itemAlmacen.datos.sort((a, b) => b.fechaCaducidad - a.fechaCaducidad); // Orden inverso para devolver las cantidades
                for (let dato of itemAlmacen.datos) {
                    let almacenMedicamento = await AlmacenMedicamentos.findById(dato._id);

                    if (almacenMedicamento.cantidad < 0) {
                        almacenMedicamento.cantidad = 0; // Asegurar que no hay cantidades negativas
                    }

                    let cantidadARevertir = Math.min(cantidadRestante, cantidadEntregada - almacenMedicamento.cantidad);

                    almacenMedicamento.cantidad += cantidadARevertir;
                    await almacenMedicamento.save();

                    cantidadRestante -= cantidadARevertir;
                    if (cantidadRestante <= 0) {
                        break;
                    }
                }
            }
        }

        // Cambiar el estado del pedido a 'cancelado'
        pedido.estado = 'cancelado';
        await pedido.save();

        res.json({ mensaje: "Pedido cancelado con éxito", pedido });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al cancelar el pedido", error: error.message });
    }
};
// Exporta las funciones
module.exports = { crearPedido, obtenerPedidos, obtenerPedido, cancelarPedido };
