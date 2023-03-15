

const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
const Stock = require('../models/Stock')
const User = require('../models/User')

router.put("/user/:id", async (req, res) => {
  /*
   On stock show page User will type in stocks ticker symbol, (input will need name: stockSymbol)
  the number of shares they want, then hit submit button to confirm purchase
   */
  //first construct purchased stock by finding it based on symbol user typed,
  //then add ownedShares prop
  const purchasedStock = {
    Stock.findOne({symbol: req.body.stockSymbol}),
    ownedShares: req.body.shareNum
  }
  let newUserBalance = req.user.currentMoney - (purchasedStock.price * purchasedStock.ownedShares);
  //Now find user based req.user.id,
  //and push purchasedStock to user ownedStocks prop
  try {
    res.status(200).json(
      await User.findByIdAndUpdate(req.user.id,
         {$push: {ownedStocks: purchasedStock}},
         {$set: {currentMoney: newUserBalance }})
      );
  } catch (error) {
      res.status(400).json({ message: "something went wrong" });
  }
});

module.exports = router;