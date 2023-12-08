const { Router } = require('express');
const { postOCR, postOCRCertificadoEmpresa } = require('../controllers/motorDeInferencia');


const router = Router();
router.post('/', postOCR);
router.post('/empresa', postOCRCertificadoEmpresa);

module.exports = router;

