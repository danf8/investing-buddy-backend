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

//update user stock current prices
router.put("/user/update/:id", async (req, res) => {
  try {
    const userInfo = await UserStocks.findOne({ uid: req.params.id });
    const stockSymbols = userInfo.ownedStocks.map(stock => stock.symbol);
    const stockPrices = await Stock.find({ symbol: { $in: stockSymbols } }, { _id: 0, symbol: 1, price: 1 });
    const priceMap = {};
    for (const stockPrice of stockPrices) {
      priceMap[stockPrice.symbol] = stockPrice.price;
    }
    const updates = userInfo.ownedStocks.map(stock => {
      return {
        updateOne: {
          filter: { 'ownedStocks.symbol': stock.symbol },
          update: { $set: { 'ownedStocks.$.currentPrice': priceMap[stock.symbol] }  }, 
        }, 
      };
    });
    await UserStocks.bulkWrite(updates);
    res.status(200).json({ message: "User stocks updated successfully" });
    // res.status(200).json(await UserStocks.bulkWrite(updates));
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
});


router.put("/users/:id", async (req, res) => {
  const userWallet = await UserStocks.findOne({uid: req.user.uid});
  const newUserBalance = (+userWallet.currentMoney) - (+req.body.price * +req.body.ownedShares);
  try {
    res.status(200).json(
      await UserStocks.findOneAndUpdate({uid: req.user.uid},
         {
          $set: {currentMoney: newUserBalance},
          $push: {ownedStocks: req.body}
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
  console.log('1')
  try {
    res.status(200).json(await UserStocks.findOne({uid: req.params.id}));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});


module.exports = router;