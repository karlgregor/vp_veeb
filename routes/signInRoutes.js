const express = require("express");
const router = express.Router();

const {signInPage, signInPagePost} = require("../controllers/signInControllers");

router.route("/").get(signInPage);
router.route("/").post(signInPagePost);
	
module.exports = router;