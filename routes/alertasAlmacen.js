const { Router } = require('express');
const { getAlertasAlmacen } = require('../controllers/alertasAlmacen');

const router = Router();
router.get('/', getAlertasAlmacen);

module.exports = router;
