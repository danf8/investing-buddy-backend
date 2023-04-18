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

router.put("/users/:id", async (req, res) => {

  const userWallet = await UserStocks.findOne({uid: req.user.uid});

  const stockPurchased = {
    name: req.body.name,
    price: req.body.price,
    symbol: req.body.symbol,
  };

  const purchasedStock = {
    stockPurchased,
    ownedShares: req.body.amountOwned
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

//creates user on mongodb from firebase
router.post("/users", async (req, res) => {
  try {
    req.body.uid = req.user.uid
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