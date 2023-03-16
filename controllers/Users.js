

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
  const purchasedStock = {
    stockToBuy,
    ownedShares: req.body.shareNum
  }
  console.log(purchasedStock)
  let newUserBalance = req.user.currentMoney - (purchasedStock.price * purchasedStock.ownedShares);
  //Now find user based req.user.id,
  //and push purchasedStock to user ownedStocks prop
  try {
    res.status(200).json(
      await UserStocks.findOneAndUpdate({uid: req.user.uid},
         {$push: {ownedStocks: purchasedStock}},
         {$set: {currentMoney: newUserBalance }}));
  } catch (error) {
      res.status(400).json({ message: "something went wrong" });
  }
});



module.exports = router;