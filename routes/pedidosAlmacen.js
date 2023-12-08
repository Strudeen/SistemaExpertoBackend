const { Router } = require("express");
const { verPedidos, actualizarEstadoPedido } = require("../controllers/pedidosAlmacen");

const router = Router();

router.get('/', verPedidos);
router.put('/:id', actualizarEstadoPedido);

module.exports = router;
