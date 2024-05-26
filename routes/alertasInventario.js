const { Router } = require('express');
const { getAlertasInventario } = require('../controllers/alertasInventario');

const router = Router();
router.get('/', getAlertasInventario);

module.exports = router;