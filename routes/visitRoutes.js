const express = require("express");
const router = express.Router();

//controllers
const {
    visitRegisterPage,
    visitRegisterPagePost,
    visitLogPage
} = require("../controllers/visitsController");

//routes
router.route("/").get(visitRegisterPage);
router.route("/").post(visitRegisterPagePost);
router.route("/log").get(visitLogPage);

module.exports = router;