const express = require('express');
const router = express.Router();

//hdnale signup form submission
router.post("/signup", async (req, res) => {
    console.log("Received a signup request");
  });

router.get("/signin", async (req, res) => {
    console.log("Received a signin request");
  });
module.exports = router;