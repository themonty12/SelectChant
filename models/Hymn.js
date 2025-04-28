const mongoose = require('mongoose');

const hymnSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['입당', '봉헌', '성체', '파견'],
    required: true
  }
});

module.exports = mongoose.model('Hymn', hymnSchema); 