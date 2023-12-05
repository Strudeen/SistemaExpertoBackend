const { Router } = require('express');
const { getAlmacenesMedicamentos, getAllAlmacenesMedicamentos, putAlmacenMedicamento, postAlmacenMedicamento, delAlmacenMedicamento } = require('../controllers/almacenMedicamento');

const router = Router();
router.get('/:id', getAlmacenesMedicamentos);
router.get('/all/:id', getAllAlmacenesMedicamentos);
router.post('/:id', postAlmacenMedicamento);
router.put('/:id', putAlmacenMedicamento);
router.delete('/:id', delAlmacenMedicamento);

module.exports = router;