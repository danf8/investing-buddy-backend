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


//update user stock to current prices on login
router.put("/user/update/:id", async (req, res) => {
  try {
    const userInfo = await UserStocks.findOne({ uid: req.params.id });
    if(userInfo.ownedStocks){
      const stockSymbols = userInfo.ownedStocks.map(stock => stock.symbol);
      const stockPrices = await Stock.find({ symbol: { $in: stockSymbols } }, { _id: 0, symbol: 1, price: 1 });
      const priceMap = {};
      for (const stockPrice of stockPrices) {
        priceMap[stockPrice.symbol] = stockPrice.price;
      }
      const updates = userInfo.ownedStocks.map(stock => {
        return {
          updateOne: {
            filter: {
              'uid': req.user.uid,
              'ownedStocks.symbol': stock.symbol
            },
            update: {
              $set: { 'ownedStocks.$.currentPrice': priceMap[stock.symbol] }
            }
          },
        };
      });
      await UserStocks.bulkWrite(updates);
      res.status(200).json(userInfo);
    }
    // res.status(200).json({ message: "Something went wrong" });
  } catch (error) {
    // res.status(400).json({ message: "Something went wrong" });
  }
});

// update users stocks if user already owns stock will update amount and price
router.put("/users/:id", async (req, res) => {
  try {
  const userWallet = await UserStocks.findOne({uid: req.user.uid});
  const newUserBalance = (+userWallet.currentMoney) - (+req.body.price * +req.body.ownedShares);
  const existingStockIndex = userWallet.ownedStocks.findIndex((stock) => stock.symbol === req.body.symbol);
  const valueOfInvestment = req.body.price * req.body.ownedShares
  if(existingStockIndex !== -1){
    const existingStock = userWallet.ownedStocks[existingStockIndex];
    const newTotalShares = existingStock.ownedShares + req.body.ownedShares;
    const newAveragePrice = (existingStock.ownedShares * existingStock.price + req.body.ownedShares * +req.body.price) / newTotalShares;
    req.body.price = newAveragePrice;
    res.status(200).json(await UserStocks.findOneAndUpdate({ uid: req.user.uid, 'ownedStocks.symbol': req.body.symbol },{
      $set: {
        'ownedStocks.$.ownedShares': newTotalShares,
        'ownedStocks.$.price': req.body.price,
      },
      $inc: { currentMoney: -req.body.price * req.body.ownedShares, 
        totalInvestmentValue: valueOfInvestment,
       },
    }));
  } else {
    res.status(200).json(await UserStocks.findOneAndUpdate({uid: req.user.uid},{
      $set: {currentMoney: newUserBalance},
      $push: {ownedStocks: req.body},
      $inc: {totalInvestmentValue: valueOfInvestment }
    }));
  };
  } catch (error) {
      res.status(400).json({ message: "something went wrong" });
  };
});

//updates user stocks and currentMoney when stock is sold
router.put("/user/form/sell/:id", async (req, res) => {
  try {
    const userWallet = await UserStocks.findOne({uid: req.user.uid})
    const stockToSell = userWallet.ownedStocks.find(stock => stock.symbol === req.body.symbol);
    const remainingShares = stockToSell.ownedShares - req.body.soldShares;
    const moneyEarned = req.body.currentPrice * req.body.soldShares;
    res.status(200).json(await UserStocks.findOneAndUpdate(
      { uid: req.user.uid, 'ownedStocks.symbol': req.body.symbol },
      {
        $set: { 'ownedStocks.$.ownedShares': remainingShares },
        $inc: { currentMoney: moneyEarned,
                totalInvestmentValue: -moneyEarned,
         }
      },
    ));
  } catch(error) {
    res.status(400).json({ message: "something went wrong" });
  };
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