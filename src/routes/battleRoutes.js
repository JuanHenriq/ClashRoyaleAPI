const express = require('express');
const { getBattleData, addBattles } = require('../controllers/battleController'); 
const router = express.Router();

// Rota para obter dados das batalhas
router.get('/', getBattleData);

// Rota para adicionar batalhas
router.post('/', addBattles); 

module.exports = router;