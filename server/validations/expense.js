const { body, query, param } = require('express-validator');

const createExpenseValidation = [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),
    body('category').trim().notEmpty().withMessage('Category is required.'),
    body('transactionType').isIn(['income', 'expense']).withMessage('Transaction type must be income or expense.'),
    body('date').isISO8601().withMessage('Valid date is required.'),
    body('notes').optional().isString().trim(),
];

const updateExpenseValidation = [
    param('id').isMongoId().withMessage('Valid expense ID is required.'),
    body('title').optional().trim().notEmpty(),
    body('amount').optional().isFloat({ gt: 0 }),
    body('category').optional().trim().notEmpty(),
    body('transactionType').optional().isIn(['income', 'expense']),
    body('date').optional().isISO8601(),
    body('notes').optional().isString().trim(),
];

const expenseIdValidation = [
    param('id').isMongoId().withMessage('Valid expense ID is required.'),
];

const expenseQueryValidation = [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sort').optional().isIn(['newest', 'oldest', 'highest', 'lowest']),
    query('transactionType').optional().isIn(['income', 'expense']),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
];

module.exports = { createExpenseValidation, updateExpenseValidation, expenseIdValidation, expenseQueryValidation };
