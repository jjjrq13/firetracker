const express = require('express');
const router = express.Router();

const Transactions = require('../models/transactions');

router.get('/', async (req, res) => {
    try {
        const currentUser = await Transactions.findById(req.session.user._id);

        let userExpenses = 0;
        let userIncome = 0;


        console.log(currentUser.transactions);

        currentUser.transactions.sort((a,b) => b.date - a.date);

        currentUser.transactions.forEach((transaction) => {
            console.log(`This is what is printing: ${transaction}`);

            console.log('This is Tpye:', transaction.type);
            console.log('this is Amount:', transaction.amount);
            if (transaction.type === 'Expense') {
                userExpenses = transaction.amount + userExpenses;
            } 
            else if (transaction.type === 'Income'){
                userIncome = transaction.amount + userIncome;
            }
        });

        currentUser.balance = userIncome - userExpenses;

        res.render('transactions/index.ejs', {
            currentUser,
            expenses: userExpenses,
            income: userIncome,
            transactions: currentUser.transactions,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/new', async (req, res) => {
    res.render('transactions/new.ejs');
});

router.post('/', async (req, res) => {
    try {
        const currentUser = await Transactions.findById(req.session.user._id);

        currentUser.transactions.push(req.body);

        await currentUser.save();

        console.log(req.body);

        res.redirect(`/users/${currentUser.username}/transactions`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;
