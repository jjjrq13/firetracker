const express = require('express');
const router = express.Router();

const Transactions = require('../models/transactions');

router.get('/', async (req, res) => {
    try {
        const currentUser = await Transactions.findById(req.session.user._id);

        const userExpenses = 0;
        const userIncome = 0;

        currentUser.transactions.forEach((transaction) => {
            if (transaction.type === 'Expense') {
                userExpenses += transaction.amount;
            } else {
                userIncome += transaction.amount;
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

module.exports = router;
