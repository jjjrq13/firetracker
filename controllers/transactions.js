const express = require('express');
const router = express.Router();

const Transactions = require('../models/transactions');

router.get('/', async (req, res) => {
    try {
        const currentUser = await Transactions.findById(req.session.user._id);

        let userExpenses = 0;
        let userIncome = 0;

        currentUser.transactions.forEach(async (transaction) => {
            if (!transaction.displayDate) {
                transaction.displayDate = transaction.date.toLocaleDateString(
                    'en-US',
                    {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    },
                );
                await currentUser.transations.save();
            }
        });

        currentUser.transactions.sort((a, b) => b.date - a.date);

        currentUser.transactions.forEach((transaction) => {
            console.log(transaction.displayDate);

            if (transaction.type === 'Expense') {
                userExpenses = transaction.amount + userExpenses;
            } else if (transaction.type === 'Income') {
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

router.get('/:transactionId', async (req, res) => {
    try {
        const currentUser = await Transactions.findById(req.session.user._id);

        const transaction = currentUser.transactions.id(
            req.params.transactionId,
        );
        console.log('this is the transaction', transaction);
        console.log(req.params.transactionId);

        res.render('transactions/show.ejs', {
            transaction: transaction,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.post('/', async (req, res) => {
    try {
        const currentUser = await Transactions.findById(req.session.user._id);

        currentUser.transactions.push(req.body);

        await currentUser.save();

        // console.log(req.body);

        res.redirect(`/users/${currentUser.username}/transactions`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:transactionId/edit', async (req, res) => {
    try {
        const currentUser = await Transactions.findById(req.session.user._id);
        const transaction = currentUser.transactions.id(
            req.params.transactionId,
        );

        const convertedDate = transaction.date.toISOString().split('T')[0];

        res.render(`transactions/edit.ejs`, {
            date: convertedDate,
            transaction: transaction,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.put('/:transactionId', async (req, res) => {
    try {
        const currentUser = await Transactions.findById(req.session.user._id);
        const transaction = currentUser.transactions.id(
            req.params.transactionId,
        );

        transaction.set(req.body);

        await currentUser.save();

        res.redirect(
            `/users/${currentUser.username}/transactions/${req.params.transactionId}`,
        );
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.delete('/:transactionId', async (req, res) => {
    try {
        const currentUser = await Transactions.findById(req.session.user._id);
        currentUser.transactions.id(req.params.transactionId).deleteOne();
        await currentUser.save();

        res.redirect(`/users/${currentUser.username}/transactions`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;
