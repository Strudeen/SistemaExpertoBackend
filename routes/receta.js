const { Router } = require('express');
const { getRecetas, postReceta, putReceta} = require('../controllers/receta');

const router = Router();
router.get('/', getRecetas);
router.put('/:id', putReceta)
router.post('/', postReceta);


module.exports = router;