// routes/inventarioPedidos.js

const express = require('express');
const router = express.Router();
const { crearPedido, obtenerPedidos, obtenerPedido, cancelarPedido } = require('../controllers/pedidosInventario');

// Ruta para crear un nuevo pedido en el inventario
router.post('/crearPedido', crearPedido);

// Ruta para obtener todos los pedidos en el inventario
router.get('/obtenerPedidos', obtenerPedidos);

// Ruta para obtener un pedido específico por su ID
router.get('/obtenerPedido/:id', obtenerPedido);

// Ruta para cancelar un pedido en el inventario por su ID
router.put('/cancelarPedido/:id', cancelarPedido);

// Aquí puedes agregar más rutas según sea necesario

module.exports = router;
