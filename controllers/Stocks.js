const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock.js')

router.get("/", (req, res) => {
  res.send('hello investing world');
});

router.get("/stocks", async (req, res) => {
  try {
    res.status(200).json(await Stock.find({}));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});
//create
router.post("/stocks", async (req, res) => {
  try {
    console.log(req.body)
    res.status(201).json(await Stock.create(req.body));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});
//delete
router.delete("/stocks/:id", async (req, res) => {
  try {
    res.status(200).json(await Stock.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
})

// Update Route
router.put("/stock/:id", async (req, res) => {
  try {
    res.status(200).json(
      await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

module.exports = router;