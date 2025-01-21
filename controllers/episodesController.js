const db = require('../db/connection');

const createEpisode = async (req, res) => {
 const { comic_id, episode_number, title, content_url } = req.body;
 try {

  if (!episode_number || !title || !content_url || !comic_id) {
   return res.status(400).json({ message: 'All fields are required' });
  }

  if (typeof episode_number !== 'number' || episode_number < 0) {
   return res.status(400).json({ message: 'Episode number must be a non-negative number' });
  }
  
  if (typeof title !== 'string' || title.trim().length === 0 || title.length > 255) {
   return res.status(400).json({ message: 'Title must be a non-empty string with a maximum length of 255 characters' });
  }

  if (typeof content_url !== 'string' || content_url.trim().length === 0 || content_url.length > 2048) {
   return res.status(400).json({ message: 'Content URL must be a non-empty string with a maximum length of 2048 characters' });
  }

  const [comic] = await db.query('SELECT * FROM comics WHERE id = ?', [comic_id]);
  if (!comic) {
   return res.status(404).json({ message: 'Comic not found' });
  } 

  const [results] = await db.query('SELECT * FROM episodes WHERE comic_id = ? AND episode_number = ?', [comic_id, episode_number]);
  if (results.length > 0) {
   return res.status(400).json({ message: 'Episode number already exists for this comic' });
  }


  await db.query(
   'INSERT INTO episodes (comic_id, episode_number, title, content_url) VALUES (?, ?, ?, ?)',
   [comic_id, episode_number, title, content_url]
  );
  res.status(201).json({ message: 'Episode created successfully' });
 } catch (error) {
  console.error('Error creating episode:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
};

const getEpisodeByComicId = async (req, res) => {
 
 const { comic_id } = req.params;
 try {
  if (!comic_id || isNaN(comic_id)) {
   return res.status(400).json({ message: 'Comic ID is required' });
  }

  const [episodes] = await db.query('SELECT episode_number, title FROM episodes WHERE comic_id = ? ORDER BY episode_number ASC', [comic_id]);
  
  if (episodes.length === 0) {
   return res.status(404).json({ message: 'Episodes not found for this comic' });
  }

  res.status(200).json({
   comic_id,
   episode_number: episodes.map((episode) => ({
    title: episode.title,
    episode_number: episode.episode_number
   })),
  });
 } catch (error) {
  console.error('Error retrieving data from database:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

const editEpisode = async (req, res) => {
 const { id } = req.params;
 const { episode_number, title, content_url } = req.body;

 try {

  if(!id || isNaN(id)) {
   return res.status(400).json({ message: 'Episode ID is required' });
  }

  if (!episode_number || !title || !content_url) {
   return res.status(400).json({ message: 'Episode number, title, and content_url are required.' });
  }

  const[episodeCheck] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);

  if (episodeCheck.length === 0) {
   return res.status(404).json({ message: 'Episode not found' });
  }

  await db.query(
   'UPDATE episodes SET episode_number = ?, title = ?, content_url = ? WHERE id = ?',
   [episode_number, title, content_url, id]
  );
  res.status(200).json({ message: 'Episode updated successfully' });
 } catch (error) {
  console.error('Error updating episode:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
};

const deleteEpisode = async (req, res) => {
 const { id } = req.params;

 try {
  if (!id) {
   return res.status(400).json({ message: 'Episode ID is required' });
  }

  const [episodeCheck] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);

  if (episodeCheck === 0) {
   return res.status(404).json({ message: 'Episode not found' });
  }

  await db.query('DELETE FROM episodes WHERE id = ?', [id]);

  res.status(200).json({ message: 'Episode deleted successfully' });
 } catch (error) {
  console.error('Error deleting episode:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
};

const getEpisodeDetails = async (req, res) => {
 const { id } = req.params;

 try {
  if (!id || isNaN(id)) {
   return res.status(400).json({ message: 'Episode ID is required' });
  }

  const [episode] = await db.query(
   'SELECT * FROM episodes WHERE id = ?',
      [id]
     );

  if (episode.length === 0) {
   return res.status(404).json({ message: 'Episode not found' });
  }

  res.status(200).json({
   episode: episode[0],
  });

 } catch (error) {
  console.error('Error retrieving data from database:', error);
  res.status(500).json({ message: 'Internal server error' });
 } 
};

module.exports = { getEpisodeByComicId, createEpisode, editEpisode, deleteEpisode, getEpisodeDetails };