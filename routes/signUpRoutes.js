const express = require("express");
const router = express.Router();

const {signUpPage, signUpPagePost} = require("../controllers/signUpControllers");

router.route("/").get(signUpPage);
router.route("/").post(signUpPagePost);
	
module.exports = router;