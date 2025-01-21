const express = require('express');
const {  createEpisode, getEpisodeByComicId, editEpisode, deleteEpisode, getEpisodeDetails } = require('../controllers/episodesController');
const { verifyTokenJWT } = require('../middlewares/jwtMiddlewares');
const router = express.Router();
module.exports = router;

router.post('/create', verifyTokenJWT, createEpisode);

router.put('/edit/:id', verifyTokenJWT, editEpisode);

router.get('/:comic_id', getEpisodeByComicId);
router.get('/details/:id', getEpisodeDetails);

router.delete('/delete/:id', verifyTokenJWT, deleteEpisode);

module.exports = router;