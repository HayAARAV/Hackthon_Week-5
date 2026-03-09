const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// POST /api/login
router.post('/', async (req, res) => {
    try {
        const { registrationId, email } = req.body;

        if (!registrationId || !email) {
            return res.status(400).json({ success: false, error: 'Registration ID and Email are required.' });
        }

        // Find the team by registration ID
        const team = await Team.findOne({ registrationId: registrationId.trim().toUpperCase() });

        if (!team) {
            return res.status(404).json({ success: false, error: 'Invalid Registration ID.' });
        }

        // Check if the provided email matches the team lead's email
        const lead = team.members.find(m => m.isLead) || team.members[0];

        // We do a case-insensitive email comparison
        if (!lead || !lead.email || lead.email.toLowerCase() !== email.trim().toLowerCase()) {
            return res.status(401).json({ success: false, error: 'Email does not match the registered Team Lead.' });
        }

        // Login successful - return team data (excluding internal ids where possible)
        return res.status(200).json({
            success: true,
            team: {
                registrationId: team.registrationId,
                teamName: team.teamName,
                track: team.track,
                problemStatement: team.problemStatement,
                members: team.members,
                registeredAt: team.registeredAt
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
    }
});

module.exports = router;
