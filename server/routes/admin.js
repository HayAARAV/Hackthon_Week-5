const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const validateToken = require('../middleware/validateToken');

// GET /api/admin/:token  — all registrations
router.get('/:token', validateToken, async (req, res) => {
    try {
        const teams = await Team.find().sort({ registeredAt: -1 }).lean();
        return res.json({ success: true, teams });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server error.' });
    }
});

// GET /api/admin/:token/stats
router.get('/:token/stats', validateToken, async (req, res) => {
    try {
        const teams = await Team.find().lean();
        const totalTeams = teams.length;
        const totalParticipants = teams.reduce((sum, t) => sum + t.members.length, 0);
        const trackCounts = {};
        teams.forEach(t => { trackCounts[t.track] = (trackCounts[t.track] || 0) + 1; });
        return res.json({ success: true, totalTeams, totalParticipants, trackCounts });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server error.' });
    }
});

// GET /api/admin/:token/export  — CSV download
router.get('/:token/export', validateToken, async (req, res) => {
    try {
        const teams = await Team.find().sort({ registeredAt: 1 }).lean();

        const escape = v => `"${String(v || '').replace(/"/g, '""')}"`;
        const header = 'Reg. ID,Team Name,Track,Problem Statement,Lead Name,Lead Roll No,Lead Email,Lead Phone,Member 2 Name,Member 2 Roll,Member 3 Name,Member 3 Roll,Member 4 Name,Member 4 Roll,Registered At';

        const rows = teams.map(t => {
            const lead = t.members.find(m => m.isLead) || t.members[0];
            const extras = t.members.filter(m => !m.isLead);
            const get = (arr, idx, field) => arr[idx] ? arr[idx][field] || '' : '';
            return [
                escape(t.registrationId),
                escape(t.teamName),
                escape(t.track),
                escape(t.problemStatement),
                escape(lead.name),
                escape(lead.rollNo),
                escape(lead.email),
                escape(lead.phone),
                escape(get(extras, 0, 'name')),
                escape(get(extras, 0, 'rollNo')),
                escape(get(extras, 1, 'name')),
                escape(get(extras, 1, 'rollNo')),
                escape(get(extras, 2, 'name')),
                escape(get(extras, 2, 'rollNo')),
                escape(new Date(t.registeredAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })),
            ].join(',');
        });

        const csv = [header, ...rows].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="hackbattle2026-registrations.csv"');
        return res.send(csv);
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server error.' });
    }
});

module.exports = router;
