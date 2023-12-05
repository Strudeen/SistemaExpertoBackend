const { Router } = require('express');
const { getInventarios, postInventario, putInventario, delInventario, getInventario } = require('../controllers/inventario');

const router = Router();
router.get('/', getInventarios);
router.post('/', postInventario);
router.put('/:id', putInventario);
router.put('/:id/delInventario', delInventario);
router.get('/:id', getInventario);

module.exports = router;