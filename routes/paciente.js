const { Router } = require('express');
const { getPacientes, postPaciente, putPaciente, delPaciente, getPaciente } = require('../controllers/paciente');

const router = Router();
router.get('/', getPacientes);
router.post('/', postPaciente);
router.put('/:id', putPaciente);
router.put('/:id/delPaciente', delPaciente);
router.get('/:id', getPaciente);

module.exports = router;