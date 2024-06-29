const { moviesJoiSchema, reviewsJoiSchema } = require("../utils/serverJoiValidations");
const AppError = require("../utils/AppError");

module.exports.moviesJoiValidation = (req, res, next) => {
    const movie = req.body;
    const { error } = moviesJoiSchema.validate(movie);
    if (error) {
        const msg = error.details.map(e => e.message).join(", ");
        throw new AppError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewsJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(", ");
        throw new AppError(msg, 400);
    } else {
        next();
    }
}
