
const db = require('../db/connection');

const createComment = async (req, res) => {
 const { comment } = req.body;

 try {
  await db.query('INSERT INTO comments (comment) VALUES (?)', [comment]);
  res.status(201).json({ message: 'Comment created successfully' });
 } catch (error) {
  console.error('Error creating comment:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
};

const editComment = async (req, res) => {
 try {
  const { body } = req.body;
  let { id } = req.params;

  const findComment = await this.db.query('SELECT * FROM comments WHERE id = ?', [id]);

  if (findComment.length === 0) {
   return res.status(404).json({ message: 'Comment not found' });
  }

  await this.db.query('UPDATE comments SET body = ? WHERE id = ?', [body, id]);

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