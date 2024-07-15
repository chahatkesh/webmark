const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies
    if (!token) {
        return res.status(401).send({ error: 'Authentication token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWTTOKEN);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Invalid authentication token' });
    }
};

module.exports = authenticate;
