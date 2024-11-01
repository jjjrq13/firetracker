const mongoose = require('mongoose');

const transactionsSchema = new mongoose.Schema({
    description: { type: String, maxlength: 100 },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now, required: true },
    type: { 
        type: String, 
        enum: ['Income', 'Expense'], 
        required: true 
    },
    category: {
        type: String,
        enum: ['Income', 'Needs', 'Wants', 'Culture', 'Unexpected', 'Saved'],
        required: true,
    },
    notes: { type: String, maxlength: 200 },
    number: { type: Number },
});

const transactionsUserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 }, 
    transactions: [trackerSchema],
});

const Transactions = mongoose.model('Transactions', transactionsUserSchema);

module.exports = Transactions;