const express = require('express');
const { createComic, getComicById, getAllComics, editComic, deleteComic } = require('../controllers/comicsController');
const { verifyTokenJWT } = require('../middlewares/jwtMiddlewares');
const upload = require('../middlewares/uploadMiddlewares');
const router = express.Router();

router.post(
 '/create',
 upload.single('cover_image'), 
 verifyTokenJWT,              
 createComic                   
);

router.put(
 '/edit/:id',
  upload.single('cover_image'),
  verifyTokenJWT,
  editComic
);

router.get('/', getAllComics);
router.get('/:id', getComicById);

router.delete(
  '/delete/:id',
  upload.single('cover_image'),
  verifyTokenJWT,
  deleteComic
);

module.exports = router;