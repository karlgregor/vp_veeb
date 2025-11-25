const express = require("express");
const router = express.Router();
const {photogalleryHome, photogalleryPersonalHome, photogalleryPersonalPic, photogalleryPersonalPicPost} = require("../controllers/photoGalleryControllers");

router.route("/").get(photogalleryHome);
router.route("/myphotos").get(photogalleryPersonalHome);
router.route("/myphotos/:id").get(photogalleryPersonalPic).get(photogalleryPersonalPicPost);

	
module.exports = router;