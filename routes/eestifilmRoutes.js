const express = require("express");
const router = express.Router();

//controllers
const {
    filmHomePage,
    filmPeoplePage, 
    filmPeopleAddPage, 
    filmPeopleAddPost, 
} = require("../controllers/eestifilmControllers");

//routes
router.route("/").get(filmHomePage);

router.route("/inimesed").get(filmPeoplePage);
router.route("/inimesed_add").get(filmPeopleAddPage);
router.route("/inimesed_add").post(filmPeopleAddPost);

module.exports = router;