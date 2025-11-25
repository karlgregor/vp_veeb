const express = require("express");
const router = express.Router();
const multer = require("multer")
const loginCheck = require("../src/loginMiddleware");

const uploader = multer({ dest: "./public/gallery/orig/" });

router.use(loginCheck.isLogin);

// controllers
const {
    galleryphotoUploadPage,
    galleryphotoUploadPagePost,
} = require("../controllers/galleryphotoUploadControllers");

// routes
router.route("/").get(galleryphotoUploadPage);
router.route("/").post(uploader.single("photoInput"), galleryphotoUploadPagePost);

module.exports = router;