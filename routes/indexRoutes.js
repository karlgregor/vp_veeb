const express = require("express");
const router = express.Router();

//controllers
const {
    indexPage,
    indexPageGetLatestPublicPhoto
} = require("../controllers/indexController");

//routes
router.route("/").get(indexPage);
router.route("/").get(indexPageGetLatestPublicPhoto);

module.exports = router;