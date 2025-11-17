const express = require("express");
const router = express.Router();
const { newsHome, newsAddPage, newsAddPagePost } = require("../controllers/newsController");

router.route("/").get(newsHome);
router.route("/add").get(newsAddPage);
router.route("/add").post(newsAddPagePost);

module.exports = router;