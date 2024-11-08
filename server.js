// ------------- PACKAGES -------------
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const authController = require('./controllers/auth.js');
const transactionController = require('./controllers/transactions.js');

// ------------- VARIABLES -------------
const port = process.env.PORT ? process.env.PORT : '3000';
const isSignedIn = require('./middleware/is-signedin.js');
const passUserToview = require('./middleware/pass-user-to-view.js');
const path = require('path');

// ------------- ACTIVATE -------------
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//------------- MIDDLEWARE -------------
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 15 * 60 * 1000 },
    }),
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(passUserToview);

//------------- ROUTES -------------
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect(`/users/${req.session.user.username}/transactions`);
    } else {
        res.render('index.ejs', { user: req.session.user });
    }
});

app.get('/about', async (req, res) => {
    res.render('about.ejs');
});

app.get('/contact', async (req, res) => {
    res.render('contact.ejs');
});

app.use('/auth', authController);

app.use(isSignedIn);

app.use('/users/:username/transactions', transactionController);

app.listen(port, () => console.log(`Express is running on port ${port}`));
