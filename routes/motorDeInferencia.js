const { Router } = require('express');
const { postFileValidation } = require('../controllers/motorDeInferencia');


const router = Router();
router.post('/', postFileValidation);

module.exports = router;

