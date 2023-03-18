const express = require('express');
const router = express.Router();
const StockIndex = require('../models/StockIndex.js');
const fetch = require("node-fetch");
const Stock = require('../models/Stock')
const UserStocks = require('../models/User')
//provides stock index data for homepage
router.get("/", async (req, res) => {
  try {
    res.status(200).json(await StockIndex.find({}));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

router.get("/userStocks/:id", async (req, res) => {
  try {
    res.status(200).json(await UserStocks.find({}));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});




//handle signup form submission

router.put("/users/:id", async (req, res) => {
  /*
   On stock show page User will type in stocks ticker symbol, (input will need name: stockSymbol)
  the number of shares they want, then hit submit button to confirm purchase
   */
  //first construct purchased stock by finding it based on symbol user typed,
  //then add ownedShares prop

  console.log('hello')
  const stockToBuy =  await Stock.findOne({symbol: req.body.stockSymbol});
  const userWallet = await UserStocks.findOne({uid: req.user.uid});
  console.log(userWallet)
  const purchasedStock = {
    stockToBuy,
    ownedShares: req.body.shareNum
  }
  console.log(+userWallet.currentMoney)
  console.log(+purchasedStock.stockToBuy.price)
  console.log(+purchasedStock.ownedShares)
  const newUserBalance = (+userWallet.currentMoney) - (+purchasedStock.stockToBuy.price * +purchasedStock.ownedShares);
  console.log(newUserBalance)
  //Now find user based req.user.id,
  //and push purchasedStock to user ownedStocks prop
  try {
    res.status(200).json(
      await UserStocks.findOneAndUpdate({uid: req.user.uid},
         {$push: {ownedStocks: purchasedStock}},
         {$set: {currentMoney: newUserBalance}}
         ));
  } catch (error) {
      res.status(400).json({ message: "something went wrong" });
  }
});

router.post("/users", async (req, res) => {
  try {
    const user = await UserStocks.findOne({ uid: req.body.uid });
    if (!user) {
      // User does not exist, so create a new user
      await UserStocks.create(req.body);
    } else {
      res.redirect("/stocks");
    }
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

module.exports = router;