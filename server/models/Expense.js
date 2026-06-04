const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: [0, 'Amount cannot be negative.'], max: [10000000, 'Amount cannot exceed 10 million.'] },
    category: { type: String, required: true, trim: true },
    transactionType: { type: String, enum: ['income', 'expense'], default: 'expense' },
    date: { type: Date, required: true },
    notes: { type: String, trim: true, default: '' },
    deleted: { type: Boolean, default: false },
}, { timestamps: true });

// Compound index: accelerates filtered queries + sorted pagination
expenseSchema.index({ userId: 1, deleted: 1, date: -1 });
// Secondary index: accelerates amount-sorted queries
expenseSchema.index({ userId: 1, deleted: 1, amount: -1 });

// Enforce per-user transaction cap (index-covered count, near-zero cost)
const MAX_TRANSACTIONS_PER_USER = 5000;

expenseSchema.pre('save', async function (next) {
    if (this.isNew) {
        const count = await this.constructor.countDocuments({
            userId: this.userId,
            deleted: false,
        });

        if (count >= MAX_TRANSACTIONS_PER_USER) {
            const err = new Error(`Transaction limit of ${MAX_TRANSACTIONS_PER_USER} reached.`);
            err.status = 403;
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model('Expense', expenseSchema);

