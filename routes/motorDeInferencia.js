const { Router } = require('express');
const { postOCR } = require('../controllers/motorDeInferencia');


const router = Router();
router.post('/', postOCR);

module.exports = router;

