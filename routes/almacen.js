const { Router } = require('express');
const { postAlmacen, getAlmacenes,getAlmacen, getAllAlmacenes, putAlmacen, delAlmacen } = require('../controllers/almacen');
const rbacMiddleware = require("../middlewares/rbac");
 
const router = Router();
router.get('/',rbacMiddleware.checkPermission('listarAlamcen'), getAlmacenes);
router.get('/:id',rbacMiddleware.checkPermission('listarAlamcen'), getAlmacen);
router.post('/',rbacMiddleware.checkPermission('crearAlamcen'), postAlmacen);
router.put('/:id',rbacMiddleware.checkPermission('editarAlamcen'), putAlmacen);
router.delete('/:id',rbacMiddleware.checkPermission('eliminarAlamcen'), delAlmacen);


module.exports = router;