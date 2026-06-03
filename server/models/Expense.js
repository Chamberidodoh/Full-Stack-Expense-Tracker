const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    transactionType: { type: String, enum: ['income', 'expense'], default: 'expense' },
    date: { type: Date, required: true },
    notes: { type: String, trim: true, default: '' },
  deleted: { type: Boolean, default: false },
