const express = require("express");
const router = express.Router();
const { homePage } = require("../controllers/homeController");
const loginCheck = require("../src/loginMiddleware");

router.use(loginCheck.isLogin);

router.get("/", homePage);

module.exports = router;