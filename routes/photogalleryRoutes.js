const express = require("express");
const router = express.Router();
const {photogalleryHome} = require("../controllers/photoGalleryControllers");

router.route("/").get(photogalleryHome);
	
module.exports = router;