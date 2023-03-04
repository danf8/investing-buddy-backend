const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema ({
  symbol: String,
  date: String,
  stockPrice: String,
  numberOfShares: String
});

module.exports = mongoose.model('Stock', stockSchema);