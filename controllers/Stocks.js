const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
const Stock = require('../models/Stock.js')
const {API_KEY} = process.env;

const url = "https://financialmodelingprep.com/api/v3/enterprise-values/AAPL?limit=40&apikey=" + API_KEY;
const stockData = [];

const getStocks = async () => {
 const response = await fetch(url);
 const data = await response.json();
 stockData.push(data);
}
getStocks();
console.log(stockData)




router.get("/", (req, res) => {
  getStocks();
  console.log(stockData)
  res.send('hello investing world');
});

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
    await console.log(req.body);
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
router.put("/stocks/:id", async (req, res) => {
  try {
    res.status(200).json(
      await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

router.get("/stocks/:id", async (req, res) => {
  try {
    res.status(200).json(await Stock.findById(req.params.id));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

module.exports = router;