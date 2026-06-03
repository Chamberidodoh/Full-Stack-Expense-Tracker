const Expense = require('../models/Expense');
const mongoose = require('mongoose');

const summary = async (req, res) => {
    const results = await Expense.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(req.user.id), deleted: false } },
        { $group: { _id: '$transactionType', total: { $sum: '$amount' } } },
    ]);

    const response = results.reduce((acc, item) => {
        acc[item._id] = item.total;
        return acc;
    }, { income: 0, expense: 0 });

    return res.json({
        totalIncome: response.income,
        totalExpenses: response.expense,
        balance: response.income - response.expense,
    });
};

const monthly = async (req, res) => {
    const results = await Expense.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(req.user.id), deleted: false } },
        {
            $group: {
                _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$transactionType' },
                total: { $sum: '$amount' },
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const data = results.reduce((acc, item) => {
        const monthName = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
        acc[monthName] = acc[monthName] || { month: monthName, income: 0, expense: 0 };
        acc[monthName][item._id.type] = item.total;
        return acc;
    }, {});

    return res.json(Object.values(data));
};

const categories = async (req, res) => {
    const results = await Expense.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(req.user.id), deleted: false } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } },
    ]);

    return res.json(results.map((item) => ({ category: item._id, total: item.total })));
};

module.exports = { summary, monthly, categories };
