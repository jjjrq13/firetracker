const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Transactions = require('../models/transactions');

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

router.post('/sign-up', async (req, res) => {
    try {
        const userInDatabase = await Transactions.findOne({
            username: req.body.username.toLowerCase(),
        });

        if (userInDatabase) {
            res.send('Username unavailable!');
            return;
        }

        if (req.body.password !== req.body.confirmPassword) {
            res.send('Passwords do not match');
            return;
        }

        if (!userInDatabase && req.body.password === req.body.confirmPassword) {
            req.body.password = bcrypt.hashSync(req.body.password, 15);
            req.body.username = req.body.username.toLowerCase();

            await Transactions.create(req.body);
        }

        res.redirect('/auth/sign-in');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.post('/sign-in', async (req, res) => {
    try {
        const userInDatabase = await Transactions.findOne({
            username: req.body.username.toLowerCase(),
        });

        if (!userInDatabase) {
            return res.send('Login failed. Please try again.');
        }

        const validPassword = bcrypt.compareSync(
            req.body.password,
            userInDatabase.password,
        );

        if (!validPassword) {
            return res.send('Login failed. Please try again.');
        }

        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id,
        };

        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
