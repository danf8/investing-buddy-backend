const express = require('express');
const router = express.Router();
const StockIndex = require('../models/StockIndex.js');

//provides stock index data for homepage
router.get("/", async (req, res) => {
  try {
    res.status(200).json(await StockIndex.find({}));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

module.exports = router;