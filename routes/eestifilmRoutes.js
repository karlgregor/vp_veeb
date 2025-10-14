const express = require("express");
const router = express.Router();

//controllers
const {
    filmHomePage,
    filmPeoplePage, 
    filmPeopleAddPage, 
    filmPeopleAddPost, 
    filmJobsPage, 
    filmJobsAddPage, 
    filmJobsPost} = require("../controllers/eestifilmControllers");

//routes
router.route("/").get(filmHomePage);

router.route("/inimesed").get(filmPeoplePage);
router.route("/inimesed_add").get(filmPeopleAddPage);
router.route("/inimesed_add").post(filmPeopleAddPost);

router.route("/ametid").get(filmJobsPage);
router.route("/ametid_add").get(filmJobsAddPage);
router.route("/ametid_add").post(filmJobsPost);

module.exports = router;