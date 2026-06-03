const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../services/tokenService');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).json({ message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id);

    return res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id);

    return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
};

const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'Profile not found.' });
    }
    return res.json(user);
};

const updateProfile = async (req, res) => {
    const { name, email, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'Profile not found.' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.avatar = avatar != null ? avatar : user.avatar;
    await user.save();

    return res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar });
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'Profile not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.json({ message: 'Password updated successfully.' });
};

module.exports = { register, login, getProfile, updateProfile, changePassword };
