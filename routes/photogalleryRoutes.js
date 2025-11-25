const express = require("express");
const router = express.Router();
const loginCheck = require("../src/loginMiddleware");
const {photogalleryHome, photogalleryPersonalHome, photogalleryPersonalPic, photogalleryPersonalPicPost} = require("../controllers/photoGalleryControllers");

router.use(loginCheck.isLogin);

router.route("/").get(photogalleryHome);
router.route("/myphotos").get(photogalleryPersonalHome);
router.route("/myphotos/:id")
  .get(photogalleryPersonalPic)
  .post(photogalleryPersonalPicPost);
	
module.exports = router;