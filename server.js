require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', require('./routes/authRoutes'));
app.use('/comics', require('./routes/comicsRoutes'));
app.use('/comments', require('./routes/commentsRoutes'));
app.use('/episodes', require('./routes/episodeRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}.`);
})