const User = require("../models/userModel");
const Review = require("../models/reviewModel");
const Movie = require("../models/movieModel");

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    return next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Login or Registeration required.")
        return res.redirect("/login");
    }
    return next();

}

module.exports.authorize = async (req, res, next) => {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie || !movie.producer.equals(req.user._id)) {
        req.flash("error", "Dont have Permission to do this");
        return res.redirect(`/campgrounds/${id}`);
    }
    return next();
}

module.exports.authorizeUser = async (req, res, next) => {
    const { id } = req.params;
    if (req.user._id.toString() !== id) {
        req.flash("error", "Dont have Permission to do this");
        return res.redirect(`/movies`);
    }
    return next();
}

module.exports.authorizeReviewer = async (req, res, next) => {
    const { rev_id } = req.params;
    const review = await Review.findById(rev_id);
    if (!review || !review.reviewer.equals(req.user._id)) {
        req.flash("error", "Dont have Permission to do this");
        return res.redirect(`/campgrounds/${camp_id}`);
    }
    return next();
}
