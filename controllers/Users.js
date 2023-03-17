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

//hdnale signup form submission
// router.post("/signup", async (req, res) => {
//     console.log("Received a signup request");
//   });

// router.get("/signin", async (req, res) => {
//     console.log("Received a signin request");
//   });
module.exports = router;