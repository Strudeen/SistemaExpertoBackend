const { Router } = require('express');
const { getReporteMesInventario } = require('../controllers/reportes');

const router = Router();
router.post('/', getReporteMesInventario);

module.exports = router;