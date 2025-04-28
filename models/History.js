const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  hymns: {
    entrance: [{
      number: Number,
      title: String
    }],
    offering: [{
      number: Number,
      title: String
    }],
    communion: [{
      number: Number,
      title: String
    }],
    closing: [{
      number: Number,
      title: String
    }]
  }
});

module.exports = mongoose.model('History', historySchema); 