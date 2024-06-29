const express = require("express");
const { index, create, show, newForm, editForm, category, whatsNew, searchResults, editMovie, deleteMovie } = require("../controllers/movieControllers");
const { isLoggedIn, authorize } = require("../utils/authMiddlewares");
const wrapAsync = require("../utils/wrapAsync");
const multer = require("multer");
const { moviesJoiValidation } = require("../utils/allValidationsFunctions");
const uploadFiles = require("../utils/uploadMiddleware");

const upload = multer({
    storage: multer.memoryStorage() // In-memory storage to handle multiple file uploads
});

const router = express.Router();

router.route("/")
    .get(wrapAsync(index))
    .post(isLoggedIn, upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'video', maxCount: 1 }]), uploadFiles, moviesJoiValidation,
        wrapAsync(create));



router.route("/categories")
    .get(wrapAsync(category));

router.route("/whatsNew")
    .get(wrapAsync(whatsNew));

router.route("/search")
    .get(wrapAsync(searchResults));

router.route("/new")
    .get(isLoggedIn, newForm);

router.route("/:id")
    .get(isLoggedIn, wrapAsync(show))
    .patch(isLoggedIn, authorize, upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'video', maxCount: 1 }]),
        uploadFiles, moviesJoiValidation, wrapAsync(editMovie))
    .delete(isLoggedIn, authorize, wrapAsync(deleteMovie));

router.route("/:id/edit")
    .get(isLoggedIn, authorize, wrapAsync(editForm));

module.exports = router;

