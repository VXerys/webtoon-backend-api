const db = require('../db/connection');
const cloudinary = require('../services/cloudinary');
const fs = require('fs');

const createComic = async (req, res) => {

  console.log("Multer Processing Result:", req.file); 
  console.log("Request Body:", req.body); 
  console.log("Headers:", req.headers); 
  
  const { title, genre, description, creator_id, cover_image_url, status} = req.body;
  
  if (!title || !creator_id) {
   return res.status(400).json({ message: 'Title and creator_id are required' });
  }

  if (!req.file) {
   return res.status(400).json({ message: 'Cover image is required' });
  }

  const cloudResult = await cloudinary.uploader.upload(req.file.path, {
    folder: 'webtoon/covers',
    format: 'webp',
    quality: 'auto:good'
  });

  fs.unlinkSync(req.file.path);
 
  try {
    const query = ` 
      INSERT INTO comics (title, genre, description, creator_id, cover_image_url, cloudinary_public_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      title,
      genre,
      description,
      creator_id,
      cloudResult.secure_url, 
      cloudResult.public_id,
      status || 'ongoing'
    ];
     await db.query(query, values);
 
     res.status(201).json({ message: 'Comic created successfully', cover_url: cloudResult.secure_url });
  } catch (error) {
    if(req.file) fs.unlinkSync(req.file.path);
   console.error('Error creating comic:', error);
   res.status(500).json({ message: 'Internal server error' });
  }
 };

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

const editComic = async (req, res) => {
 const { id } = req.params;
 const { title, genre, description, creator_id, cover_image_url, status } = req.body;

 try {
  if (!title || !creator_id) {
   return res.status(400).json({ message: 'Title and creator_id are required' });
  }
  
  let updateValues = [title, genre, description, creator_id, cover_image_url, status];
  let query = `
    UPDATE comics 
    SET title = ?, genre = ?, description = ?, creator_id = ?, status = ?
  `;

  if (req.file) {
    const [oldComic] = await db.query(
      'SELECT cloudinary_public_id FROM comics WHERE id = ?',
      [id]
    );

    const cloudResult = await  cloudinary.uploader.upload(req.file.path, {
      folder: 'webtoon/covers',
      format: 'webp'
    });

    query = query.replace('status = ?', 'cover_image_url = ?, cloudinary_public_id = ?, status = ?');
    
    updateValues.splice(4, 0, cloudResult.secure_url, cloudResult.public_id);

    if (oldComic[0].cloudinary_public_id) {
      await cloudinary.uploader.destroy(oldComic[0].cloudinary_public_id);
    }

    fs.unlinkSync(req.file.path);
  }

  query += 'WHERE id = ? ';
  updateValues.push(id);

  await db.query(query, updateValues);
  
  res.status(200).json({ message: 'Comic updated successfully' });
 } catch (error) {
  if (req.file) fs.unlinkSync(req.file.path);
  console.error('Error updating comic:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
};

const deleteComic = async (req, res) => {
 const { id } = req.params;
 try {
  const [comic] = await db.query(
   'SELECT cloudinary_public_id FROM comics WHERE id = ?',
   [id] 
  );
  
  if (comic[0]?.cloudinary_public_id) {
   await cloudinary.uploader.destroy(comic[0].cloudinary_public_id);
  }

  db.query('DELETE FROM comics WHERE id = ?', [id]);
  res.status(200).json({ message: 'Comic deleted successfully' });
 } catch (error) {
  console.error('Error deleting comic:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
};

module.exports = {
 getAllComics,
 getComicById,
 createComic,
 editComic,
 deleteComic,
};