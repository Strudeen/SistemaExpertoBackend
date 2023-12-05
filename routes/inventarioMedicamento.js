const { Router } = require('express');
const { getInventariosMedicamentos, getInventarioMedicamento, getAllInventariosMedicamentos, postInventarioMedicamento, putInventarioMedicamento, delInventarioMedicamento } = require('../controllers/inventarioMedicamento');

const router = Router();
router.get('/:id', getInventariosMedicamentos);
router.get('/all/:id', getAllInventariosMedicamentos);
router.post('/:id', postInventarioMedicamento);
router.put('/:id', putInventarioMedicamento);
router.delete('/:id', delInventarioMedicamento);
router.get('/edit/:id', getInventarioMedicamento);


module.exports = router;