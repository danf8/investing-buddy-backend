const User = require('../models/User');
const Stock = require('../models/Stock.js');

const CronJob = require('cron').CronJob;

// Update each user's performance
const job = new CronJob('0 * * * *', async () => {
    let time = new Date();
    let currentDate = time.toJSON().slice(0, 10);
    const utcTime = time.getUTCHours();
    const estTime = (utcTime - 4);
    if(estTime === 17){
      const users = await User.find();
      const stocks = await Stock.find();
      for(const user of users) {
        const totalValue = user.totalInvestmentValue + user.currentMoney;
        const performance = user.performance || { historical: [] };
        performance.historical.push({
          date: currentDate,
          totalValue,
        });
        await User.updateOne({ _id: user._id }, { $set: { performance } });
      };
      for(const stock of stocks){
        const historical = stock.historical;
        historical.push({
          date: currentDate,
          close: stock.price
        });
      await Stock.updateOne({symbol: stock.symbol}, {$set: {historical}});
    };
    };
  });

  job.start();
