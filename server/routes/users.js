const express = require('express');
const UserData = require('../models/UserData');
const authenticate = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    const { name, category, link, tag, icon } = req.body;
    const userId = req.userId;

    try {
        const userData = new UserData({ name, category, link, tag, icon, userId });
        await userData.save();
        res.status(201).send(userData);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
