const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_webtoon'
});

db.getConnection((err, connection) => {
    if (err) {
        console.log('Database connection failed:', err.message);
    } else {
        console.log('Database Connected');
        connection.release();
    }
}) 

module.exports = db