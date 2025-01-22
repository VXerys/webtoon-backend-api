const express = require('express');
const { createComment, getCommentsByComicId, editComment, deleteComment, getCommentsByEpisodeId } = require('../controllers/commentsController');
const { verifyTokenJWT } = require('../middlewares/jwtMiddlewares');
const router = express.Router();

router.post('/create-comment', verifyTokenJWT, createComment);

router.get('/get-comments/:comic_id', getCommentsByComicId);
router.get('/get-comments-episode/:episode_id', getCommentsByEpisodeId);

router.put('/edit-comment/:id', verifyTokenJWT, editComment);

router.delete('/delete-comment/:id', verifyTokenJWT, deleteComment);

module.exports = router;