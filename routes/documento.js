const { Router } = require('express');
const { getDocumentos, postDocumento, putDocumento, delDocumento, getDocumento } = require('../controllers/documento');

const router = Router();
router.get('/', getDocumentos);
router.post('/', postDocumento);
router.put('/:id', putDocumento);
router.put('/:id/delDocumento', delDocumento);
router.get('/:id', getDocumento);

module.exports = router;