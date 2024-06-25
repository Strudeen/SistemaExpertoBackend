const { Router } = require('express');
const { postAlmacen, getAlmacenes,getAlmacen, getAllAlmacenes, putAlmacen, delAlmacen } = require('../controllers/almacen');
const rbacMiddleware = require("../middlewares/rbac");
 
const router = Router();
router.get('/', getAlmacenes);
router.get('/:id', getAlmacen);
router.post('/', postAlmacen);
router.put('/:id', putAlmacen);
router.delete('/:id', delAlmacen);


module.exports = router;