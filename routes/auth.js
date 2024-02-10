const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email address is already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).send('User created');
    } catch (error) {
        console.error('Error registering new user:', error);
        res.status(500).send('Error registering new user');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('User not found');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const userId = user._id;
        console.log({userId})
        res.status(200).json({ token , userId });
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

module.exports = router;
