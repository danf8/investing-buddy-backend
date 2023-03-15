const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const stockIndexSchema = new Schema({
    symbol: String,
    historical: [{    
        date: String,
        close: Number,
    }]
});

module.exports = mongoose.model('StockIndex', stockIndexSchema);