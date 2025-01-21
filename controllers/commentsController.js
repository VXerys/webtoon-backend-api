
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

  

const getComments = (req, res) => {
 db.query('SELECT * FROM comments', (err, results) => {
  if (err) {
   console.error('Error retrieving comments:', err);
   res.status(500).json({ message: 'Internal server error' });
  } else {
   res.status(200).json(results);
  }
 });
};


module.exports = {
 getComments,
 createComment,
 editComment
};