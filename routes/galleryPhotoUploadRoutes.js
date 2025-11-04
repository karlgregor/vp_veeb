const express = require("express");
const router = express.Router();
const multer = require("multer")

const uploader = multer({ dest: "./public/gallery/orig/" });
const upload = uploader.single("photoInput");

// controllers
const {
    galleryphotoUploadPage,
    galleryphotoUploadPagePost,
} = require("../controllers/galleryphotoUploadControllers");

// routes
router.route("/").get(galleryphotoUploadPage);
router.route("/").post(upload, galleryphotoUploadPagePost);

module.exports = router;