const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockPurchased = new Schema({
  name: {type: String},
  price: {type: Number},
  currentPrice: {type: Number},
  symbol: {type: String},
  ownedShares: {type: Number},
});

const trackPortfolio = new Schema({
  historical: [{    
    date: String,
    totalValue: Number,
}]
});

const userStocks = new Schema({
    totalInvestmentValue: {type: Number},
    ownedStocks: [stockPurchased],
    performance: trackPortfolio,
    currentMoney: {
        type: Number,
        required: true
      },
      startingMoney: {
        type: Number,
        required: true,
      },
      uid: {
        type: String,
      }
    }, {timestamps: true});

module.exports = mongoose.model('User', userStocks); 