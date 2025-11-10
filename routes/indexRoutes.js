const express = require("express");
const router = express.Router();
const { indexPage } = require("../controllers/indexController");

router.get("/", indexPage);

module.exports = router;