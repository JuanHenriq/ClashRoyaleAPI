const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  nickname: { type: String, required: true },
  expLevel: { type: Number, required: true },
  trophies: { type: Number, required: true },
  playTime: { type: Number, required: true },
  clan: { type: String }
});

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;