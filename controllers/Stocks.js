const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
const Stock = require('../models/Stock.js')
const {API_KEY} = process.env;

const url = "https://financialmodelingprep.com/api/v3/quote/SPY,QQQ,DIA,AAPL,META,GOOG,AMZN,MCD,KO,VZ,MSFT,BA?apikey=" + API_KEY;
let stockData;

const getStocks = async () => {
  const response = await fetch(url);
  const data = await response.json();
  stockData = data
  // stockData.push(data);
}

getStocks();


// router.get('/stocks/seed', async (req, res) => {
//   getStocks();
//   const allStocks = stockData[0];
//   Promise.all(allStocks.map(async (stock) => {
//     req.body = stock
//       try {
//         await
//         res.status(200).json(await Stock.create(req.body));
//       } catch (error) {
//         res.status(400).json({ message: "something went wrong" });
//       }
//   }));
// })

router.get('/stocks/seed', (req, res) => {
  getStocks()
  Stock.create(stockData)
  res.send('seeded')
})

router.get("/", (req, res) => {
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
    await
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
      await Stock.findByIdAndUpdate(req.params.id, {$push: {comments: req.body.comments}})
      );
  } catch (error) {
      res.status(400).json({ message: "something went wrong" });
  }
});

router.get("/stocks/:id", async (req, res) => {
  console.log('test')
  try {
    res.status(200).json(await Stock.findById(req.params.id));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

module.exports = router;