const db = require('../db/connection');

const getAllComics = async (req, res ) => {
 try {
  const [comics] = await db.query('SELECT * FROM comics');
  res.status(200).json(comics);
 } catch (error) {
  console.error('Error retrieving data from database:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
};

const getComicById = async (req, res) => {
 const { id } = req.params;

 try {
  const [results] = await db.query('SELECT * FROM comics WHERE id = ?', [id]);
  if (results.length === 0) {
   return res.status(404).json({ message: 'Comic not found' });
  }
  res.status(200).json(results[0]);
 } catch (error) {
  console.error('Error retrieving data from database:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
};

const createComic = async (req, res) => {
 const { title, genre, description, creator_id, cover_image_url, status} = req.body;
 
 if (!title || !creator_id) {
  return res.status(400).json({ message: 'Title and creator_id are required' });
 }

 try {
  const query = ` 
      INSERT INTO comics (title, genre, description, creator_id, cover_image_url, status)
      VALUES (?, ?, ?, ?, ?, ?)
    ;`
    const values = [title, genre, description, creator_id, cover_image_url, status || 'ongoing'];
    await db.query(query, values);

    res.status(201).json({ message: 'Comic created successfully' });
 } catch (error) {
  console.error('Error creating comic:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
};

module.exports = {
 getAllComics,
 getComicById,
 createComic
};