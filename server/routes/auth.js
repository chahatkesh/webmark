// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        const user = new User({ username, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWTTOKEN, { expiresIn: '1h' });

        // Set the token as an HTTP-only cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send({ error: 'Invalid username or password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWTTOKEN, { expiresIn: '1h' });

        // Set the token as an HTTP-only cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.send({ message: 'Login successful' });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
