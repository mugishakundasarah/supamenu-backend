const mongoose = require('mongoose');

const mongoURL = 'mongodb://localhost:27017/supa-menu'; // Replace with your MongoDB connection URL

function connectToDB() {
  return mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
}

module.exports = connectToDB;
