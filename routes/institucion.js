const { Router } = require('express');
const { getInstitucion, postInstitucion, putInstitucion, getInst } = require('../controllers/institucion');

const router = Router();
router.get('/', getInstitucion);
router.get('/:id', getInst);
router.post('/', postInstitucion);
router.put('/:id', putInstitucion);


module.exports = router;
