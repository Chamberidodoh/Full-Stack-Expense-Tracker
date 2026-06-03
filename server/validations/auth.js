const { body } = require('express-validator');

const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
];

const profileUpdateValidation = [
    body('name').optional().isString().trim(),
    body('email').optional().isEmail().withMessage('Valid email is required.'),
    body('avatar').optional().isURL().withMessage('Avatar must be a valid URL.'),
];

const changePasswordValidation = [
    body('currentPassword').notEmpty().withMessage('Current password is required.'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters.'),
];

module.exports = {
    registerValidation,
    loginValidation,
    profileUpdateValidation,
    changePasswordValidation,
};
