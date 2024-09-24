const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const playerRoutes = require('./src/routes/playerRoutes');
const battleRoutes = require('./src/routes/battleRoutes');
const queryRoutes = require('./src/routes/queryRoutes'); 

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

app.use('/players', playerRoutes);
app.use('/battles', battleRoutes);
app.use('/queries', queryRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});