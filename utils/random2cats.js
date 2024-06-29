const { Category, allCat } = require("../models/categoryModel");
const randCategory = () => {
    const randomCats = [];
    for (let i = 0; i < 2; i++) {
        randomCats.push(allCat[Math.floor(Math.random() * allCat.length)])
    }
    return randomCats;
}


const randomCatMovies = async () => {
    const final = [];
    const randCats = randCategory();
    for (let cat of randCats) {
        const genres = await Category.findOne({ title: cat }).populate("movies");
        const movies = genres.movies;
        final.push(movies)
    }
    return final;
}

module.exports = randomCatMovies;