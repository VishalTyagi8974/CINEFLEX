const { Category, allCat } = require("../models/categoryModel");
const randCategory = () => {
    const randomCats = [];
    for (let i = 0; i < 5; i++) {
        randomCats.push(allCat[Math.floor(Math.random() * allCat.length)])
    }
    return randomCats;
}
const randomMovies = async () => {
    const final = [];
    const randCats = randCategory()
    for (let cat of randCats) {
        const genres = await Category.findOne({ title: cat }).populate("movies");
        const movies = genres.movies;
        if (movies) {
            final.push(movies[(Math.floor(Math.random() * movies.length))]);
        }

    }
    return final;
}

module.exports = randomMovies;
