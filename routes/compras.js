const { Router } = require('express');
const { getCompras, postCompra, putCompra, deleteCompra, getCompra } = require('../controllers/compras')

const router = Router();
router.get('/', getCompras);
router.post('/', postCompra);
router.put('/:id', putCompra);
router.put('/:id/delCompra', deleteCompra);
router.get('/:id', getCompra);

module.exports = router;