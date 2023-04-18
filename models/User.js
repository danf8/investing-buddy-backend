const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userStocks = new Schema({
    ownedStocks: [
        {
          type: Array,
        }
      ],
    currentMoney: {
        type: Number,
        required: true
      },
      uid: {
        type: String
      }
    }, {timestamps: true});

module.exports = mongoose.model('User', userStocks); 