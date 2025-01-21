const express = require('express');
const { createComment, getComments } = require('../controllers/commentsController');
const { verifyTokenJWT } = require('../middlewares/jwtMiddlewares');
const router = express.Router();

router.post('/create-comment', verifyTokenJWT, createComment);
router.get('/', getComments);

module.exports = router;