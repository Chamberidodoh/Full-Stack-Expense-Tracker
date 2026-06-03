const express = require('express');
const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
});

router.post('/', async (req, res) => {
    const { title, amount, category, date, notes } = req.body;
    if (!title || amount == null || !category || !date) {
        return res.status(400).json({ message: 'Title, amount, category, and date are required.' });
    }

    const expense = new Expense({
        user: req.user.id,
        title,
        amount,
        category,
        date,
        notes,
    });

    await expense.save();
    res.status(201).json(expense);
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    const expense = await Expense.findOneAndUpdate({ _id: id, user: req.user.id }, update, {
        new: true,
        runValidators: true,
    });

    if (!expense) {
        return res.status(404).json({ message: 'Expense not found.' });
    }

    res.json(expense);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: id, user: req.user.id });
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found.' });
    }
    res.json({ message: 'Expense removed', id });
});

router.get('/summary/chart', async (req, res) => {
    const expenses = await Expense.aggregate([
        { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } },
    ]);

    res.json(expenses.map((row) => ({ category: row._id, total: row.total })));
});

module.exports = router;
