const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const path = require('path');
const app = express();
const moviesRoutes = require("./routes/movies_routes");
const usersRoutes = require("./routes/users_routes");
const reviewsRoutes = require("./routes/review_routes");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/userModel");
const flash = require("connect-flash");
const AppError = require("./utils/AppError");
const mongoSanitize = require("express-mongo-sanitize");
const methodOverride = require("method-override");
const helmet = require('helmet');


const MongoStore = require("connect-mongo");


if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const dbUrl = process.env.DB_URL;

const secret = process.env.SECRET;
mongoose.connect(dbUrl)
    .then(() => {
        console.log("connected to CINEFLEX Database");
    })
    .catch(() => {
        console.log("connection failed");
    });

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function (e) {
    console.log(e);
})


const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "'unsafe-inline'",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com/jquery-3.5.1.min.js"
];

const styleSrcUrls = [
    "'unsafe-inline'",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "https://getbootstrap.com/",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com"
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", "https://res.cloudinary.com/dtgebpxfb/", "https://plus.unsplash.com/", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: ["'unsafe-inline'"],
            imgSrc: [
                "'self'",
                "'unsafe-inline'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dtgebpxfb/",
                "https://images.unsplash.com",
                "https://plus.unsplash.com/"
            ],
            videoSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dtgebpxfb/",
            ],
        },
    })
);



app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, "/views"));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    store,
    name: "GoodDay",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}));




app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(
    mongoSanitize({
        allowDots: true,
    }),
);



passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://cineflex.onrender.com/auth/google/callback"
},
    async (token, tokenSecret, profile, done) => {
        try {
            let username = profile.displayName;
            let counter = 1000;

            while (await User.findOne({ username })) {
                username = `${username}${counter}`;
                counter++;
            }

            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = new User({
                    username,
                    email: profile.emails[0].value,
                    googleId: profile.id
                });
                await user.save();
            }

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));

const crypto = require('crypto');
app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('hex');
    next();
});

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    res.locals.error = req.flash("error");
    next();
})



app.get("/", (req, res) => {
    res.render("movies/home");
});
app.use("/movies", moviesRoutes);
app.use("/movies/:id/reviews", reviewsRoutes);
app.use("/", usersRoutes);



app.use((err, req, res, next) => {
    if (err.name == "ValidationError") {
        err = new AppError("Form data cant be validated due to wrong inputs", 400);
    } else if (err.name == "CastError") {
        err = new AppError("Unable to find anything", 404)
    }
    next(err);
})

app.use("*", (req, res, next) => {
    next(new AppError("Page not Found", 404));
})

app.use((err, req, res, next) => {
    const { status = 500, message = "Something Went Wrong" } = err;
    res.status(status).render("movies/errors", { status, message });
})

app.listen(3000, () => {
    console.log("starts listening at 3000 port");
})
