const { Router } = require('express');
const { getRecetas, postReceta, putReceta,getReceta} = require('../controllers/receta');

const router = Router();
router.get('/', getRecetas);
router.get('/:id', getReceta);
router.put('/:id', putReceta);
router.post('/', postReceta);


module.exports = router;