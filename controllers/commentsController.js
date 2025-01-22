
const db = require('../db/connection');

const createComment = async (req, res) => {
 const { comment_text, comic_id, user_id, episode_id } = req.body;

 try {

   if (!comment_text || !comic_id || !user_id) {
     return res.status(400).json({ message: 'Comment text, comic_id, and user_id are required' });
   }

   if (typeof comment_text !== 'string') {
     return res.status(400).json({ message: 'Comment must be a string' });
   }

   const trimmedComment = comment_text.trim();
   if (trimmedComment.length < 3 || trimmedComment.length > 255) {
     return res.status(400).json({ message: 'Comment must be between 3 and 255 characters' });
   }

   if (isNaN(comic_id) || isNaN(user_id) || (episode_id && isNaN(episode_id))) {
    return res.status(400).json({ message: 'comic_id, user_id, and episode_id (if provided) must be valid numbers.' });
   }

   
   const [userCheck] = await db.query('SELECT * FROM users WHERE id = ?', [user_id]);
   if (userCheck.length === 0) {
     return res.status(404).json({ message: 'User not found' });
   }

   if (episode_id) {
     const [episodeCheck] = await db.query('SELECT * FROM episodes WHERE id = ? AND comic_id = ?', [episode_id, comic_id]);
     if (episodeCheck.length === 0) {
       return res.status(404).json({ message: 'Episode not found' });
     }
   }

   await db.query(
     'INSERT INTO comments (comment_text, comic_id, user_id, episode_id, create_at) VALUES (?, ?, ?, ?, NOW())',
     [trimmedComment, comic_id, user_id, episode_id || null] 
   );

   res.status(201).json({ message: 'Comment created successfully' });
 } catch (error) {
   console.error('Error creating comment:', error);
   res.status(500).json({ message: 'Internal server error' });
 }
};


const editComment = async (req, res) => {

  const { comment_text } = req.body;
  let { id } = req.params;

  try {
    if (!id || isNaN(id)) {
      return res.status(404).json({ message: 'Valid  comment ID is required' });
    }

    if (!comment_text || typeof comment_text !== 'string') {
      return res.status(400).json({ message: 'Comment must be a string' });
    }

    const trimmedComment = comment_text.trim();
    if (trimmedComment.length < 3 || trimmedComment.length > 255) {
      return res.status(400).json({ message: 'Comment must be between 3 and 255 characters' });
    }

    const [findComment] = await db.query('SELECT * FROM comments WHERE id = ?', [id])
    if (findComment.length == 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await db.query('UPDATE comments SET comment_text = ? WHERE id = ?', [trimmedComment, id]);
    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {

    if (!id || isNaN(id)) {
      return res.status(404).json({ message: 'Valid  comment ID is required' });
    }

    const [findComment] = await db.query('SELECT * FROM comments WHERE id = ?', [id])
    if (findComment.length == 0) {
      return res.status(404).json({ message: 'Comment not found' });
    } 

    await db.query('DELETE FROM comments WHERE id = ?', [id]);

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  

const getCommentsByComicId = async (req, res) => {
  const { comic_id } = req.params;

  try {
    if (!comic_id || isNaN(comic_id)) {
      return res.status(400).json({ message: 'Valid comic ID is required.' });
    }

    const [comments] = await db.query('SELECT * FROM comments WHERE comic_id = ? ORDER BY create_at DESC', [comic_id]);

    if (comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this comic.' });
    }

    res.status(200).json({ comic_id, comments });
  } catch (error) {
    console.error('Error retrieving comments:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getCommentsByEpisodeId = async (req, res) => {
  const { episode_id } = req.params;

  try {
    if (!episode_id || isNaN(episode_id)) {
      return res.status(400).json({ message: 'Valid episode ID is required.' });
    }

    const [comments] = await db.query(`SELECT 
         comments.id AS comment_id,
         comments.comment_text,
         comments.create_at,
         users.id AS user_id,
         users.username AS user_name
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.episode_id = ?
       ORDER BY comments.create_at DESC`,
      [episode_id]);

    if (comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this episode.' });
    }

    res.status(200).json({ episode_id, comments });
    
  } catch (error) {
    console.error('Error retrieving comments:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
 getCommentsByComicId,
 createComment,
 editComment,
 deleteComment,
 getCommentsByEpisodeId
};