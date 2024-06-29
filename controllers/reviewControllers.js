const Movie = require("../models/movieModel");
const Review = require("../models/reviewModel");

module.exports.createReview = async (req, res, next) => {
    const { id } = req.params;
    const movie = await Movie.findById(id);

    const review = new Review(req.body.review);
    review.reviewer = req.user._id;
    movie.reviews.push(review);
    await review.save();
    await movie.save();
    req.flash("success", "Successfully shared your Review")
    res.redirect(`/movies/${id}`)
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, rev_id } = req.params;
    const movie = await Movie.findById(id);
    movie.reviews = movie.reviews.filter(id => id !== rev_id);
    await Review.findByIdAndDelete(rev_id);
    await movie.save();
    req.flash("info", "Review Deleted")
    res.redirect(`/movies/${id}`)
}