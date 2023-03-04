
///////////////////////////////
// Dependencies
////////////////////////////////
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
// create application object
const app = express();
const Stock = require('./models/Stock.js')
///////////////////////////////
// Application Settings
////////////////////////////////
require('dotenv').config();

const { PORT = 3001, DATABASE_URL } = process.env;

const stocksRouter = require('./controllers/Stocks');


///////////////////////////////
// Database Connection
////////////////////////////////
mongoose.connect(DATABASE_URL);
// Mongo connection Events
mongoose.connection
  .on('open', () => console.log('You are connected to MongoDB'))
  .on('close', () => console.log('You are disconnected from MongoDB'))
  .on('error', (error) => console.log(`MongoDB Error: ${error.message}`));

///////////////////////////////
// Mount Middleware
////////////////////////////////
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(stocksRouter);
///////////////////////////////
// Mount Routes
////////////////////////////////

// create a test route

///////////////////////////////
// Tell the app to listen
////////////////////////////////
app.listen(PORT, () => {
  console.log(`Express is listening on port: ${PORT}`);
});