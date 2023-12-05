const { Router } = require('express');
const { postAlmacen, getAlmacenes, getAllAlmacenes, putAlmacen, delAlmacen } = require('../controllers/almacen');

const router = Router();
router.get('/', getAlmacenes);
router.get('/all', getAllAlmacenes);
router.post('/', postAlmacen);
router.put('/:id', putAlmacen);
router.delete('/:id', delAlmacen);


module.exports = router;