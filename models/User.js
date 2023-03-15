const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    ownedStocks: [
        {
          type: Array
        }
      ],
    currentMoney: {
        type: Number,
        required: true
      }
    }, {timestamps: true});

module.exports = mongoose.model('User', userSchema);