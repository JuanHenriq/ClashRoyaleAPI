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
const { addBattles } = require('../controllers/battleController');

const router = express.Router();

// Rota para adicionar batalhas e depois realizar consultas
router.post('/update-and-query', async (req, res) => {
  try {
    await addBattles(req, res);

    const { queryType, ...queryParams } = req.query;

    switch (queryType) {
      case 'win-loss-percentage':
        await getWinLossPercentageByCard({ query: queryParams }, res);
        break;
      case 'winning-decks':
        await getWinningDecks({ query: queryParams }, res);
        break;
      case 'losses-by-combo':
        await getLossesByCardCombo({ query: queryParams }, res);
        break;
      case 'wins-by-card-conditions':
        await getWinsByCardWithConditions({ query: queryParams }, res);
        break;
      case 'winning-card-combos':
        await getWinningCardCombos({ query: queryParams }, res);
        break;
      case 'average-trophies':
        await getAverageTrophies({ query: queryParams }, res);
        break;
      case 'top-players-by-wins':
        await getTopPlayersByWins({ query: queryParams }, res);
        break;
      case 'win-percentage-by-level':
        await getWinPercentageByLevel({ query: queryParams }, res);
        break;
      default:
        res.status(400).json({ error: 'Tipo de consulta inválido.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas existentes para consultas
router.get('/win-loss-percentage', getWinLossPercentageByCard);
router.get('/winning-decks', getWinningDecks);
router.get('/losses-by-combo', getLossesByCardCombo);
router.get('/wins-by-card-conditions', getWinsByCardWithConditions);
router.get('/winning-card-combos', getWinningCardCombos);
router.get('/average-trophies', getAverageTrophies);
router.get('/top-players-by-wins', getTopPlayersByWins);
router.get('/win-percentage-by-level', getWinPercentageByLevel);

module.exports = router;