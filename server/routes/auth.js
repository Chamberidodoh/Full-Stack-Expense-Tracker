const express = require('express');
const { validationResult } = require('express-validator');
const authenticate = require('../middleware/auth');
const authController = require('../controllers/authController');
const {
    registerValidation,
    loginValidation,
    profileUpdateValidation,
    changePasswordValidation,
} = require('../validations/auth');

const router = express.Router();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};

router.post('/register', registerValidation, handleValidation, authController.register);
router.post('/login', loginValidation, handleValidation, authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, profileUpdateValidation, handleValidation, authController.updateProfile);
router.put('/change-password', authenticate, changePasswordValidation, handleValidation, authController.changePassword);

module.exports = router;
