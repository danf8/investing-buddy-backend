const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema ({
  symbol: String,
  name: String,
  price: String,
  changesPercentage: Number,
  marketCap: Number,
  eps: Number,
  pe: Number,
  comments: Array
});

module.exports = mongoose.model('Stock', stockSchema);