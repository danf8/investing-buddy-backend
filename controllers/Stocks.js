const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
const Stock = require('../models/Stock.js')
const StockIndex = require('../models/StockIndex.js');
const UserStocks = require('../models/User')
const {API_KEY} = process.env;
let combineString;

let url = '';

let stockData;
let stockIndexData;

const updateString = async() => {
  let symbolString =[]
  const stocks = await Stock.find();
  for(const stock of stocks){
    symbolString.push(stock.symbol)
  }
  combineString = symbolString.join();
  url = `https://financialmodelingprep.com/api/v3/quote/${combineString}?apikey=` + API_KEY;
  getStocks()
}
const getStocks = async () => {
  const response = await fetch(url);
  const data = await response.json();
  stockData = data; 
}; 

// seeds database
router.get('/stocks/seed', async (req, res) => {
  getStocks();
  Stock.create(stockData);
  StockIndex.create(stockIndexData);
  res.send('seeded');
});
// shows stock index 
router.get("/stocks", async (req, res) => {
  try {
    res.status(200).json(await Stock.find({}));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

router.get('/stocks/search/stock/:id', async (req, res) => {
  const searchURL = `https://financialmodelingprep.com/api/v3/quote/${req.params.id.toUpperCase()}?apikey=` + API_KEY;
  const searchHistoricalURL = `https://financialmodelingprep.com/api/v3/historical-price-full/${req.params.id.toUpperCase()}?serietype=line&timeseries=60&apikey=` + API_KEY;
  const historicalResponse = await fetch(searchHistoricalURL)
  const searchResponse = await fetch(searchURL);
  const historicalData = await historicalResponse.json()
  const searchData = await searchResponse.json();
  try {
    await Stock.create(searchData);
    await Stock.updateOne({symbol: historicalData.symbol},{$set: {historical: historicalData.historical.reverse()}});
    res.status(200).json(await Stock.find({}));
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "something went wrong" });
  }
}); 
 
//create
router.post("/stocks", async (req, res) => {
  try {
    res.status(200).json(await Stock.create(req.body));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

//delete
router.delete("/stocks/:id", async (req, res) => {
  try {
    res.status(200).json(await Stock.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

// Update Route
router.post('/stocks/update-prices', async (req, res) => {
  updateString();
  const response = await fetch(url);
  const data = await response.json();
  stockData = data;
  try {
    for (const stock of stockData) {
      await Stock.findOneAndUpdate(
        { symbol: stock.symbol },
        { $set: { price: stock.price } }
      );
    }
    res.status(200).send('Prices updated successfully');
  } catch (err) {
    res.status(500).send('Error updating prices');
  }
});

// add comments to individual stock
router.put("/stocks/:id", async (req, res) => {
  try {
    res.status(200).json(
      await Stock.findOneAndUpdate({symbol: req.params.id}, {$push: {comments: req.body.comments}})
      );
  } catch (error) {
      res.status(400).json({ message: "something went wrong" });
  }
});

// show stock page
router.get("/stocks/:id", async (req, res) => {
  try {
    res.status(200).json(await Stock.findOne({symbol: req.params.id}));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

module.exports = router;