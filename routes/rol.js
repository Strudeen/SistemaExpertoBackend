const { Router } = require('express');
const { getRoles, postRol, putRol, delRol, getRol } = require('../controllers/rol');

const router = Router();
router.get('/', getRoles);
router.post('/', postRol);
router.put('/:id', putRol);
router.put('/:id/delRol', delRol);
router.get('/:id', getRol);

module.exports = router;