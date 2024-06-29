const User = require("../models/userModel");

module.exports.loginForm = (req, res) => {
    res.render("users/login");
}

module.exports.signupForm = (req, res) => {
    res.render("users/signup");
}

module.exports.loginUser = (req, res) => {
    const returnTo = res.locals.returnTo || "/movies";
    req.flash("success", "Welcome Back")
    res.redirect(`${returnTo}`);
}

module.exports.signupUser = async (req, res) => {
    try {
        const { username, email, password, isProductionHouse } = req.body;
        const newUser = new User({ username, email });
        if (isProductionHouse) {
            newUser.isProductionHouse = true;
        }
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err)
            const returnTo = res.locals.returnTo || "/movies";
            req.flash("success", "Welcome to CINEFLEX");
            return res.redirect(`${returnTo}`);
        })

    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
}

module.exports.userPage = (req, res) => {
    res.render("users/user");
}
module.exports.tobeProduction = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { isProductionHouse: true });
    res.redirect(`/users/${id}`);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('info', 'Logged Out');
        res.redirect('/movies');
    });
}
