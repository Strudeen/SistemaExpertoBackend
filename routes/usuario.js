const { Router } = require('express');
const { getUsuarios, postUsuario, putUsuario, delUsuario, getUsuario, putUsuarioPassword } = require('../controllers/usuario');

const router = Router();
router.get('/', getUsuarios);
router.post('/', postUsuario);
router.put('/:id', putUsuario);
router.put('/:id/delUsuario', delUsuario);
router.get('/:id', getUsuario);
router.put('/:id/password', putUsuarioPassword)

module.exports = router;