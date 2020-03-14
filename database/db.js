const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost:27017/newsData')
    .then(() => console.log('Database connected'))
    .catch((error) => console.log('EROOR',error));

module.exports = db;