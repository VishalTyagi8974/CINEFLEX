const Movie = require("../models/movieModel");

async function findLatestMovies() {
    const latestMovies = await Movie.find()
        .sort({ releaseDate: -1 }) // Sort by releaseDate in descending order
        .limit(10); // Limit the result to the last 10 movies

    return latestMovies;
}

module.exports = findLatestMovies;