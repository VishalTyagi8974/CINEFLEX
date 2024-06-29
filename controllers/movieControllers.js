const { query } = require("express");
const Movie = require("../models/movieModel");
const { Category, allCat } = require("../models/categoryModel");
const crousalDivMovies = require("../utils/crousalDiv");
const random2cats = require("../utils/random2cats");
const findLatestMovies = require("../utils/findlatestMovies");
const { cloudinary } = require("../cloudinary")

module.exports.index = async (req, res) => {

    const crousalMovies = await crousalDivMovies();
    const random2MovieCats = await random2cats();
    const currentUrl = req.originalUrl;
    res.render("movies/index", { allCat, crousalMovies, currentUrl, random2MovieCats });
}

module.exports.show = async (req, res, next) => {
    const { id } = req.params;
    const movie = await Movie.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "reviewer"
            }
        })
        .populate("producer");
    if (!movie) {
        throw new AppError("cant find the campGround", 404)
    }
    res.render("movies/show", { movie });
}

module.exports.searchResults = async (req, res) => {
    const { searchedMovie } = req.query;
    const regex = new RegExp(searchedMovie, 'i');
    const movies = await Movie.find({ title: regex });
    res.render("movies/searchedMovies", { movies, searchedMovie });
}

module.exports.whatsNew = async (req, res) => {
    const latestMovies = await findLatestMovies();
    const currentUrl = req.originalUrl;
    res.render(`movies/whatsNew`, { latestMovies, allCat, currentUrl })
}

module.exports.create = async (req, res) => {
    const newMovie = req.body;
    const { genres } = req.body;
    newMovie.producer = req.user;
    newMovie.poster = {
        url: req.uploadedFiles.posterUpload.secure_url,
        filename: req.uploadedFiles.posterUpload.public_id
    };
    newMovie.video = {
        url: req.uploadedFiles.videoUpload.secure_url,
        filename: req.uploadedFiles.videoUpload.public_id
    };
    const uploadMovie = new Movie(newMovie);
    const category = await Category.findOne({ title: genres });
    if (category) {
        category.movies.push(uploadMovie);
        await uploadMovie.save();
        await category.save();
    }
    res.redirect(`/movies/${uploadMovie._id}`);
}

module.exports.newForm = (req, res) => {
    res.render("movies/create")
}
module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    res.render("movies/edit", { movie });
}

module.exports.category = async (req, res) => {
    const { genres } = req.query;
    const currentUrl = req.originalUrl;
    const categoryMovies = await Category.findOne({ title: genres })
        .populate("movies");

    res.render("movies/categoryMovies", { movies: categoryMovies.movies, category: categoryMovies.title, allCat, currentUrl, nonce: res.locals.nonce });
}

module.exports.editMovie = async (req, res) => {
    const { id } = req.params;
    const movie = await Movie.findByIdAndUpdate(id, req.body, { runValidators: true });
    if (req.uploadedFiles.posterUpload) {
        if (movie.poster && movie.poster.filename) {
            await cloudinary.uploader.destroy(movie.poster.filename, { resource_type: 'image' });
        }
        movie.poster = {
            url: req.uploadedFiles.posterUpload.secure_url,
            filename: req.uploadedFiles.posterUpload.public_id
        };
    }

    if (req.uploadedFiles.videoUpload) {
        if (movie.video && movie.video.filename) {
            await cloudinary.uploader.destroy(movie.video.filename, { resource_type: 'video' });
        }
        movie.video = {
            url: req.uploadedFiles.videoUpload.secure_url,
            filename: req.uploadedFiles.videoUpload.public_id
        };
    }
    await movie.save();
    res.redirect(`/movies/${id}`);
}

module.exports.deleteMovie = async (req, res) => {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id);
    req.flash("info", "Movie Deleted")
    res.redirect("/movies")
}

