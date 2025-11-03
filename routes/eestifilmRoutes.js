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
    filmJobsAddPost,
    filmPosition,
    filmPositionAddPost,
    filmAddPage,
    filmAddPagePost,
    seosAddPage,
    seosAddPagePost,
    seosedList
} = require("../controllers/eestifilmControllers");

//routes
router.route("/").get(filmHomePage);

router.route("/inimesed").get(filmPeoplePage);
router.route("/inimesed_add").get(filmPeopleAddPage);
router.route("/inimesed_add").post(filmPeopleAddPost);

router.route("/ametid").get(filmJobsPage);
router.route("/ametid_add").get(filmJobsAddPage);
router.route("/ametid_add").post(filmJobsAddPost)

router.route("/film_add").get(filmAddPage);
router.route("/film_add").post(filmAddPagePost);

router.route("/seos_add").get(seosAddPage);
router.route("/seos_add").post(seosAddPagePost);
router.route("/seosed").get(seosedList);

module.exports = router;