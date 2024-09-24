const mongoose = require('mongoose');

const battleSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  player1: { type: String, required: true }, 
  player2: { type: String, required: true }, 
  player1Towers: { type: Number, required: true },
  player2Towers: { type: Number, required: true },
  winner: { type: String, required: true }, 
  player1Deck: { type: [String], required: true },
  player2Deck: { type: [String], required: true },
  player1Trophies: { type: Number, required: true },
  player2Trophies: { type: Number, required: true },
});

module.exports = mongoose.model('Battle', battleSchema);