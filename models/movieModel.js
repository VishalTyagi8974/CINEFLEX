const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync");
const { cloudinary } = require("../cloudinary");
const Review = require("./reviewModel");

const posterSchema = new mongoose.Schema({
    url: String,
    filename: String,
});

const videoSchema = new mongoose.Schema({
    url: String,
    filename: String,
});

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    releaseDate: {
        type: String,
        default: function () {
            return new Date(Date.now()).toString().slice(4, 15);
        }
    },
    ageRating: {
        type: String,
        enum: ["A", "UA", "U"],
        required: true
    },
    poster: posterSchema,
    genres: {
        type: String,
        enum: ["Action", "Adventure", "Comedy", "Drama", "Horror",
            "Science Fiction", "Fantasy", "Thriller", "Mystery", "Romance",
            "Crime", "Historical", "Western", "Musical", "Animation",
            "Anime", "Family", "Documentary", "War", "Sports", "Superhero"],
        required: true
    },
    video: videoSchema,
    producer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
});

movieSchema.post("findOneAndDelete", async function (movie) {
    if (movie) {
        await Review.deleteMany({ _id: { $in: movie.reviews } });

        if (movie.poster && movie.poster.filename) {
            await cloudinary.uploader.destroy(movie.poster.filename, { resource_type: 'image' });
        }

        if (movie.video && movie.video.filename) {
            await cloudinary.uploader.destroy(movie.video.filename, { resource_type: 'video' });
        }
    }
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
