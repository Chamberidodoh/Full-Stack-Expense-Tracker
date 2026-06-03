const Expense = require('../models/Expense');
const mongoose = require('mongoose');

const getExpenses = async (req, res) => {
    const { page = 1, limit = 10, search = '', category = '', transactionType = '', startDate = '', endDate = '', sort = 'newest' } = req.query;
    const filters = { userId: req.user.id, deleted: false };

    if (search) {
        filters.title = { $regex: search, $options: 'i' };
    }
    if (category) {
        filters.category = category;
    }
    if (transactionType) {
        filters.transactionType = transactionType;
    }
    if (startDate || endDate) {
        filters.date = {};
        if (startDate) filters.date.$gte = new Date(startDate);
        if (endDate) filters.date.$lte = new Date(endDate);
    }

    const sortMap = {
        newest: { date: -1 },
        oldest: { date: 1 },
        highest: { amount: -1 },
        lowest: { amount: 1 },
    };

    const expenses = await Expense.find(filters)
        .sort(sortMap[sort] || { date: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

    const total = await Expense.countDocuments(filters);

    return res.json({ expenses, total, page: Number(page), limit: Number(limit) });
};

const getExpenseById = async (req, res) => {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id, deleted: false });
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found.' });
    }
    return res.json(expense);
};

const createExpense = async (req, res) => {
    const expense = await Expense.create({
        userId: req.user.id,
        title: req.body.title,
        amount: req.body.amount,
        category: req.body.category,
        transactionType: req.body.transactionType || 'expense',
        date: req.body.date,
        notes: req.body.notes || '',
    });

    return res.status(201).json(expense);
};

const updateExpense = async (req, res) => {
    const expense = await Expense.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id, deleted: false },
        { $set: req.body },
        { new: true, runValidators: true }
    );

    if (!expense) {
        return res.status(404).json({ message: 'Expense not found.' });
    }

    return res.json(expense);
};

const deleteExpense = async (req, res) => {
    const expense = await Expense.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id, deleted: false },
        { $set: { deleted: true } },
        { new: true }
    );

    if (!expense) {
        return res.status(404).json({ message: 'Expense not found.' });
    }

    return res.json({ message: 'Expense deleted successfully.' });
};

module.exports = { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense };
