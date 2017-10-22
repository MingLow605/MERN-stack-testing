const mongoose = require('mongoose');
const User = require('./user').userSchema;
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const timerSchema = new Schema({

  user: { type: Schema.Types.ObjectId, ref: 'User' },
  timeTrack: Number,
  distance: Number
}, {
  timestamps: true
}, {
  collection: 'timers'
});

module.exports = mongoose.model('Timer', timerSchema);
