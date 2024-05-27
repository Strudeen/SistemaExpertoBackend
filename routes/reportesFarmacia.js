const { Router } = require('express');
const { getReporteMesFarmacia } = require('../controllers/reportesFarmacia');

const router = Router();
router.post('/', getReporteMesFarmacia);

module.exports = router;