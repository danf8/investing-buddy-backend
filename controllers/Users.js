const express = require('express');
var cors = require('cors')
const router = express.Router();
const StockIndex = require('../models/StockIndex.js');
const fetch = require("node-fetch");
const Stock = require('../models/Stock')
const UserStocks = require('../models/User')
router.use(cors())
//provides stock index data for homepage
router.get("/", async (req, res) => {
  try {
    res.status(200).json(await StockIndex.find({}));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

//handle signup form submission
router.put("/users/:id", async (req, res) => {
  const stockToBuy =  await Stock.findOne({symbol: req.body.stockSymbol});
  const userWallet = await UserStocks.findOne({uid: req.user.uid});

  const stockPurchased = {
    name: stockToBuy.name,
    price: stockToBuy.price,
    symbol: stockToBuy.symbol,
  };

  const purchasedStock = {
    stockPurchased,
    ownedShares: req.body.shareNum
  };

  const newUserBalance = (+userWallet.currentMoney) - (+purchasedStock.stockPurchased.price * +purchasedStock.ownedShares);
  try {
    res.status(200).json(
      await UserStocks.findOneAndUpdate({uid: req.user.uid},
         {
          $set: {currentMoney: newUserBalance},
          $push: {ownedStocks: purchasedStock}
        }
         ));
  } catch (error) {
      res.status(400).json({ message: "something went wrong" });
  }
});

router.post("/users", async (req, res) => {
  try {
    await
    res.status(200).json(await UserStocks.create(req.body));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

router.get("/userStocks/:id", async (req, res) => {
  try {
    res.status(200).json(await UserStocks.findOne({uid: req.params.id}));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

module.exports = router;