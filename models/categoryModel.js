const mongoose = require("mongoose");


// const arr = ["Action", "Adventure", "Comedy", "Drama", "Horror",
//     "Science Fiction", "Fantasy", "Thriller", "Mystery", "Romance",
//     "Crime", "Historical", "Western", "Musical", "Animation",
//     "Anime", "Family", "Documentary", "War", "Sports", "Superhero"]

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ["Action", "Adventure", "Comedy", "Drama", "Horror",
            "Science Fiction", "Fantasy", "Thriller", "Mystery", "Romance",
            "Crime", "Historical", "Western", "Musical", "Animation",
            "Anime", "Family", "Documentary", "War", "Sports", "Superhero"],
        required: true
    },
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    }]
})
const Category = mongoose.model("Category", categorySchema);

// async function createCategories(arr) {
//     await Category.deleteMany({});
//     for (let cat of arr) {
//         const newCat = new Category({
//             title: cat,
//             movie: []
//         })
//         await newCat.save();
//     }
// }

const allCat = categorySchema.path("title").enumValues;

// createCategories(arr).then(() => {
//     mongoose.connection.close();
// })

module.exports = { Category, allCat };

