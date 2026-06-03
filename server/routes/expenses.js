const express = require('express');
const { validationResult } = require('express-validator');
const authenticate = require('../middleware/auth');
const expenseController = require('../controllers/expenseController');
const {
    createExpenseValidation,
    updateExpenseValidation,
    expenseIdValidation,
    expenseQueryValidation,
} = require('../validations/expense');

const router = express.Router();
router.use(authenticate);

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};

router.get('/', expenseQueryValidation, handleValidation, expenseController.getExpenses);
router.get('/:id', expenseIdValidation, handleValidation, expenseController.getExpenseById);
router.post('/', createExpenseValidation, handleValidation, expenseController.createExpense);
router.put('/:id', updateExpenseValidation, handleValidation, expenseController.updateExpense);
router.delete('/:id', expenseIdValidation, handleValidation, expenseController.deleteExpense);

module.exports = router;
