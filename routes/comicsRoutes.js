const express = require('express');
const { createComic, getComicById, getAllComics, editComic, deleteComic } = require('../controllers/comicsController');
const { verifyTokenJWT } = require('../middlewares/jwtMiddlewares');
const router = express.Router();

router.post('/create', verifyTokenJWT, createComic);

router.put('/edit/:id', verifyTokenJWT, editComic);

router.get('/', getAllComics);
router.get('/:id', getComicById);

router.delete('/delete/:id', verifyTokenJWT, deleteComic);

module.exports = router;