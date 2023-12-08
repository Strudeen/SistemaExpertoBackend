const { Router } = require('express');
const { getAlmacenesMedicamentos,getAlmacenMedicamento, getAllAlmacenesMedicamentos, putAlmacenMedicamento, postAlmacenMedicamento, delAlmacenMedicamento } = require('../controllers/almacenMedicamento');

const router = Router();
router.get('/:id', getAlmacenesMedicamentos);
router.get('/all/:id', getAllAlmacenesMedicamentos);
router.get('/edit/:id', getAlmacenMedicamento);
router.post('/:id', postAlmacenMedicamento);
router.put('/:id', putAlmacenMedicamento);
router.delete('/:id', delAlmacenMedicamento);

module.exports = router;