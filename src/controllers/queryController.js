const Battle = require('../models/battle');

// 1. Calcule a porcentagem de vitórias e derrotas utilizando a carta X
const getWinLossPercentageByCard = async (req, res) => {
  const { card, startTime, endTime } = req.query;
  try {
    const battles = await Battle.find({
      timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) },
      $or: [{ player1Deck: card }, { player2Deck: card }],
    });
    const wins = battles.filter(battle => battle.winnerDeck.includes(card)).length;
    const losses = battles.length - wins;
    const winPercentage = (wins / battles.length) * 100;
    const lossPercentage = (losses / battles.length) * 100;
    res.status(200).json({ winPercentage, lossPercentage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Liste os decks completos que produziram mais de X% de vitórias
const getWinningDecks = async (req, res) => {
  const { winRate, startTime, endTime } = req.query;
  try {
    const battles = await Battle.find({
      timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) },
    });

    const deckWins = {};
    battles.forEach(battle => {
      if (battle.winnerDeck && Array.isArray(battle.winnerDeck)) {
        const deck = battle.winnerDeck.join(',');
        if (!deckWins[deck]) deckWins[deck] = 0;
        deckWins[deck]++;
      }
    });

    const totalBattles = battles.length;
    const winningDecks = Object.keys(deckWins).filter(deck => (deckWins[deck] / totalBattles) * 100 > winRate);

    res.status(200).json(winningDecks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 3. Calcule a quantidade de derrotas utilizando o combo de cartas
const getLossesByCardCombo = async (req, res) => {
  const { cards, startTime, endTime } = req.query;
  try {
    const battles = await Battle.find({
      timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) },
      $or: [{ player1Deck: { $all: cards } }, { player2Deck: { $all: cards } }],
    });
    const losses = battles.filter(battle => !battle.winnerDeck.includes(cards)).length;
    res.status(200).json({ losses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Calcule a quantidade de vitórias envolvendo a carta X
const getWinsByCardWithConditions = async (req, res) => {
    const { card, trophyDifference, startTime, endTime } = req.query;
    try {
      const battles = await Battle.find({
        timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) },
        $or: [{ player1Deck: card }, { player2Deck: card }],
        $and: [
          { 'winner.trophies': { $lt: { $subtract: ['$loser.trophies', trophyDifference] } } },
          { duration: { $lt: 120 } },
          { 'loser.towers': { $gte: 2 } },
        ],
      });
      const wins = battles.filter(battle => battle.winnerDeck.includes(card)).length;
      res.status(200).json({ wins });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // 5. Liste o combo de cartas de tamanho N que produziram mais de Y% de vitórias
  const getWinningCardCombos = async (req, res) => {
    const { comboSize, winRate, startTime, endTime } = req.query;
    try {
      const battles = await Battle.find({
        timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) },
      });
      const comboWins = {};
      battles.forEach(battle => {
        const combos = getCombos(battle.winnerDeck, comboSize);
        combos.forEach(combo => {
          const comboKey = combo.join(',');
          if (!comboWins[comboKey]) comboWins[comboKey] = 0;
          comboWins[comboKey]++;
        });
      });
      const totalBattles = battles.length;
      const winningCombos = Object.keys(comboWins).filter(combo => (comboWins[combo] / totalBattles) * 100 > winRate);
      res.status(200).json(winningCombos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Função auxiliar para gerar combinações de cartas
  const getCombos = (deck, size) => {
    const results = [];
    const f = (prefix, deck) => {
      if (prefix.length === size) {
        results.push(prefix);
        return;
      }
      for (let i = 0; i < deck.length; i++) {
        f([...prefix, deck[i]], deck.slice(i + 1));
      }
    };
    f([], deck);
    return results;
  };

  // 6 - Médias de Troféus
  
  const getAverageTrophies = async (req, res) => {
    const { startTime, endTime } = req.query;
    try {
      const battles = await Battle.find({
        timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) },
      });
      const totalTrophies = battles.reduce((acc, battle) => acc + battle.player1Trophies + battle.player2Trophies, 0);
      const averageTrophies = totalTrophies / (battles.length * 2);
      res.status(200).json({ averageTrophies });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // 7 - Jogadores por Vitórias

  const getTopPlayersByWins = async (req, res) => {
    const { startTime, endTime } = req.query;
    try {
      const battles = await Battle.find({
        timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) },
      });
      const playerWins = {};
      battles.forEach(battle => {
        const winner = battle.winner.toString();
        if (!playerWins[winner]) playerWins[winner] = 0;
        playerWins[winner]++;
      });
      const sortedPlayers = Object.keys(playerWins).sort((a, b) => playerWins[b] - playerWins[a]);
      res.status(200).json(sortedPlayers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // 8 - Porcentagem de Vitórias por Nível

  const getWinPercentageByLevel = async (req, res) => {
    const { level, startTime, endTime } = req.query;
    try {
      const battles = await Battle.find({
        timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) },
        $or: [{ 'player1.level': level }, { 'player2.level': level }],
      });
      const wins = battles.filter(battle => battle.winner.level === level).length;
      const totalBattles = battles.length;
      const winPercentage = (wins / totalBattles) * 100;
      res.status(200).json({ winPercentage });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = {
    getWinLossPercentageByCard,
    getWinningDecks,
    getLossesByCardCombo,
    getWinsByCardWithConditions,
    getWinningCardCombos,
    getAverageTrophies,
    getTopPlayersByWins,
    getWinPercentageByLevel
  };