const express = require('express');
const { getPlayerData } = require('../controllers/playerController');
const router = express.Router();

router.post('/:nickname', getPlayerData);

module.exports = router;