const axios = require('axios');
const Player = require('../models/player'); 

const getPlayerData = async (req, res) => {
  const { nickname } = req.params; 
  try {
    const formattedTag = nickname.replace('#', '%23');

    const response = await axios.get(`https://api.clashroyale.com/v1/players/${formattedTag}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_ROYALE_API_KEY}`
      }
    });

    const playerData = response.data;
    const player = new Player({
      tag: playerData.tag,
      nickname: playerData.name,
      expLevel: playerData.expLevel,
      trophies: playerData.trophies,
      playTime: playerData.playTime || 0, 
      clan: playerData.clan ? playerData.clan.name : null,
      
    });    

    console.log(playerData); 

    await player.save();
    res.status(200).json(player);
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'Jogador não encontrado.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = {
  getPlayerData
};