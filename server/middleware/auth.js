const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required.' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.id };
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired authentication token.' });
    }
};

module.exports = authenticate;
