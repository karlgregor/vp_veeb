const express = require ("express");
const router = express.Router();

// controllers
const {
    galleryphotoUploadPage,
    galleryphotoUploadPagePost,
} = require("../controllers/galleryphotoUploadControllers");

// routes
router.route("/").get(galleryphotoUploadPage);
router.route("/").post(galleryphotoUploadPagePost);

module.exports = router;