const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
const Stock = require('../models/Stock.js')
const StockIndex = require('../models/StockIndex.js');
const UserStocks = require('../models/User')
const {API_KEY} = process.env;

const indexURL = "https://financialmodelingprep.com/api/v3/historical-price-full/SPY?serietype=line&timeseries=90&apikey=" + API_KEY;
const url = "https://financialmodelingprep.com/api/v3/quote/SPY,QQQ,DIA,AAPL,META,GOOG,AMZN,MCD,KO,VZ,MSFT,BA?apikey=" + API_KEY;
const stockUrlHistorical = "https://financialmodelingprep.com/api/v3/historical-price-full/VZ,MSFT,BA?serietype=line&timeseries=60&apikey=" + API_KEY;
let stockData;
let stockIndexData;
let stockHistorical;

const getStocks = async () => {
  const response = await fetch(url);
  const data = await response.json();
  stockData = data; 
};
// getStocks();
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
})

// Update Route
router.post('/stocks/update-prices', async (req, res) => {
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