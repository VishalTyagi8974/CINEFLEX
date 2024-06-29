const express = require("express");
const { loginForm, loginUser, signupForm, signupUser, userPage, logout, tobeProduction } = require("../controllers/userControllers");
const passport = require("passport");
const { storeReturnTo, isLoggedIn, authorizeUser } = require("../utils/authMiddlewares")
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();

router.route("/login")
    .get(loginForm)
    .post(storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), loginUser);

router.route("/signup")
    .get(signupForm)
    .post(wrapAsync(signupUser))

router.route("/users/:id")
    .get(isLoggedIn, authorizeUser, userPage)
    .post(isLoggedIn, authorizeUser, wrapAsync(tobeProduction));

router.get('/logout', logout);

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback', storeReturnTo,
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const returnTo = res.locals.returnTo || "/movies";
        req.flash("success", "Welcome");
        res.redirect(`${returnTo}`);
    });

module.exports = router;

