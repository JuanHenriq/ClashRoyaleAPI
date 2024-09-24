const express = require('express');
const {
  getWinLossPercentageByCard,
  getWinningDecks,
  getLossesByCardCombo,
  getWinsByCardWithConditions,
  getWinningCardCombos,
  getAverageTrophies,
  getTopPlayersByWins,
  getWinPercentageByLevel,
} = require('../controllers/queryController');

const router = express.Router();

router.get('/win-loss-percentage', getWinLossPercentageByCard);
router.get('/winning-decks', getWinningDecks);
router.get('/losses-by-combo', getLossesByCardCombo);
router.get('/wins-by-card-conditions', getWinsByCardWithConditions);
router.get('/winning-card-combos', getWinningCardCombos);
router.get('/average-trophies', getAverageTrophies);
router.get('/top-players-by-wins', getTopPlayersByWins);
router.get('/win-percentage-by-level', getWinPercentageByLevel);

module.exports = router;