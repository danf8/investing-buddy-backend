const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema ({
  symbol: String,
  name: String,
  price: String,
  changesPercentage: { type: Number,       
    set: (value) => {
    return Math.round(value * 100) / 100;
  }},
  marketCap: Number,
  eps: {type: Number,       
    set: (value) => {
    return Math.round(value * 100) / 100;
  }},
  pe: {type: Number, 
    set: (value) => {
      return Math.round(value * 100) / 100;
    }
  },
  comments: Array,
  historical: [{
    date: String,
    close: Number,
  }],
});

module.exports = mongoose.model('Stock', stockSchema);