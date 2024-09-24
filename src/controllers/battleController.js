const axios = require('axios');
const Battle = require('../models/battle');
const Player = require('../models/player');

// Função para obter dados das batalhas
const getBattleData = async (req, res) => {
  try {
    const response = await axios.get('https://api.clashroyale.com/v1/battles', {
      headers: { Authorization: `Bearer ${process.env.CLASH_ROYALE_API_KEY}` },
    });

    const battles = [];

    for (const battle of response.data.items) {
      const player1Tag = battle.team[0].tag;
      const player1Data = await getPlayerData(player1Tag);

      const player2Tag = battle.opponent[0].tag;
      const player2Data = await getPlayerData(player2Tag);

      const winnerDeck = battle.team[0].crowns > battle.opponent[0].crowns ? battle.team[0].cards.map(card => card.name) : battle.opponent[0].cards.map(card => card.name);

      battles.push({
        timestamp: new Date(battle.battleTime),
        player1: player1Data.tag,
        player2: player2Data.tag,
        player1Towers: battle.team[0].crowns,
        player2Towers: battle.opponent[0].crowns,
        winner: battle.team[0].crowns > battle.opponent[0].crowns ? player1Data.tag : player2Data.tag,
        player1Deck: battle.team[0].cards.map(card => card.name),
        player2Deck: battle.opponent[0].cards.map(card => card.name),
        player1Trophies: battle.team[0].startingTrophies,
        player2Trophies: battle.opponent[0].startingTrophies,
        winnerDeck: winnerDeck // Adicione esta linha
      });

      await savePlayerData(player1Data);
      await savePlayerData(player2Data);
    }

    await Battle.insertMany(battles);
    res.status(200).json(battles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Função para adicionar batalhas
const addBattles = async (req, res) => {
  try {
    const battles = req.body; 
    const savedBattles = await Battle.insertMany(battles);
    res.status(201).json(savedBattles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Função para obter e salvar dados do jogador
const getPlayerData = async (nickname) => {
  const formattedTag = nickname.replace('#', '%23');
  const response = await axios.get(`https://api.clashroyale.com/v1/players/${formattedTag}`, {
    headers: { Authorization: `Bearer ${process.env.CLASH_ROYALE_API_KEY}` },
  });
  return {
    tag: response.data.tag,
    name: response.data.name,
    expLevel: response.data.expLevel,
    trophies: response.data.trophies,
    playTime: response.data.playTime,
    clan: response.data.clan ? response.data.clan.name : null,
  };
};

// Função para salvar dados do jogador
const savePlayerData = async (playerData) => {
  await Player.findOneAndUpdate(
    { tag: playerData.tag },
    playerData,
    { upsert: true }
  );
};

module.exports = { getBattleData, addBattles }; 