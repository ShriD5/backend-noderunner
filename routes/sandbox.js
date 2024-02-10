const express = require('express');
const { executeUserCode } = require('../services/lamdaServices');
const Sandbox = require('../models/Sanbox');


const router = express.Router();
router.use(express.json());

// Save Sandbox
router.post('/sandbox', async (req, res) => {
    try {
        const { user, code } = req.body;
        const sandbox = new Sandbox({ user, code });
        await sandbox.save();
        res.status(201).json(sandbox);
    } catch (error) {
        console.error('Error saving sandbox:', error);
        res.status(500).json({ error: 'Failed to save sandbox', details: error.message });
    }
});

// Get saved wala Sandboxes
router.get('/sandbox', async (req, res) => {
    try {
        const sandboxes = await Sandbox.find();
        res.json(sandboxes);
    } catch (error) {
        console.error('Error retrieving sandboxes:', error);
        res.status(500).json({ error: 'Failed to retrieve sandboxes', details: error.message });
    }
});

router.post('/user', async (req, res) => {
    const { userId } = req.body;
    try {
        console.log({userId})
        const sandboxes = await Sandbox.find({ user: userId });
        console.log({sandboxes})
        res.status(200).json(sandboxes);
    } catch (error) {
        console.error('Error fetching sandboxes:', error);
        res.status(500).json({ error: 'Failed to fetch sandboxes' });
    }
});

router.post('/execute', async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const { code } = req.body;
        const response = await executeUserCode(code);
        console.log({response})
        const responseBody = JSON.parse(response.body);
        console.log({responseBody})
        const result = responseBody.result;
        console.log({result})
        res.status(response.statusCode).json({ result });
    } catch (error) {
        console.error('Error executing code:', error);
        res.status(500).json({ error: 'Failed to execute code', details: error.message });
    }
});


router.get('/sandbox/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sandbox = await Sandbox.findById(id);
        if (!sandbox) {
            return res.status(404).json({ error:'Sandbox not found' });
        }
        res.json(sandbox);
    } catch (error) {
        console.error('Error retrieving specific sandbox:', error);
        res.status(500).json({ error: 'Failed to retrieve specific sandbox', details: error.message });
    }
});


router.put('/sandbox/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { code } = req.body;
        const updatedSandbox = await Sandbox.findByIdAndUpdate(id, { code }, { new: true });

        if (!updatedSandbox) {
            return res.status(404).json({ error: 'Sandbox not found' });
        }

        res.json(updatedSandbox);
    } catch (error) {
        console.error('Error updating sandbox:', error);
        res.status(500).json({ error: 'Failed to update sandbox', details: error.message });
    }
});

module.exports = router;




