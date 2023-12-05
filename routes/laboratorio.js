const { Router } = require('express');
const { getLaboratorios, postLaboratorio, putLaboratorio, delLaboratorio, getLaboratorio } = require('../controllers/laboratorio');

const router = Router();
router.get('/', getLaboratorios);
router.post('/', postLaboratorio);
router.put('/:id', putLaboratorio);
router.put('/:id/delLaboratorio', delLaboratorio);
router.get('/:id', getLaboratorio);

module.exports = router;