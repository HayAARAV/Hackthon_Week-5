const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// GET /api/check-roll/:rollNo
router.get('/:rollNo', async (req, res) => {
    try {
        const rollNo = req.params.rollNo.toUpperCase();
        const team = await Team.findOne({ 'members.rollNo': rollNo });
        return res.json({ rollNo, taken: !!team });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server error.' });
    }
});

module.exports = router;
