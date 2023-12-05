const { Router } = require('express');
const { getMedicamentos, postMedicamento, putMedicamento, delMedicamento, getMedicamento } = require('../controllers/medicamento');

const router = Router();
router.get('/', getMedicamentos);
router.post('/', postMedicamento);
router.put('/:id', putMedicamento);
router.put('/:id/delMedicamento', delMedicamento);
router.get('/:id', getMedicamento);

module.exports = router;