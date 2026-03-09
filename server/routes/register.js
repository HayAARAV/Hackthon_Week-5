const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { registrationLimiter } = require('../middleware/rateLimiter');
const nodemailer = require('nodemailer');

const ROLL_REGEX = /^[0-9]{4}[A-Z]{2,5}[0-9]{3}$/;

// POST /api/register
router.post('/', registrationLimiter, async (req, res) => {
    try {
        const { teamName, track, problemStatement, members } = req.body;

        // ── Basic validation ──────────────────────────────────────
        if (!teamName || !track || !problemStatement || !members || !Array.isArray(members)) {
            return res.status(400).json({ success: false, error: 'Missing required fields.' });
        }
        if (members.length < 1 || members.length > 4) {
            return res.status(400).json({ success: false, error: 'Team must have 1 to 4 members.' });
        }

        const validTracks = ['Healthcare', 'Agriculture', 'Finance', 'Artificial Intelligence', 'Student Innovation'];
        if (!validTracks.includes(track)) {
            return res.status(400).json({ success: false, error: 'Invalid track selected.' });
        }
        if (problemStatement.length < 100 || problemStatement.length > 500) {
            return res.status(400).json({ success: false, error: 'Problem statement must be 100–500 characters.' });
        }

        // ── Member validation ─────────────────────────────────────
        const rollNosInTeam = [];
        for (let i = 0; i < members.length; i++) {
            const m = members[i];
            if (!m.name || !m.rollNo) {
                return res.status(400).json({ success: false, error: `Member ${i + 1}: name and roll number are required.` });
            }
            const rollUp = m.rollNo.toUpperCase();
            if (!ROLL_REGEX.test(rollUp)) {
                return res.status(400).json({ success: false, error: `Invalid roll number format: ${rollUp}` });
            }
            if (rollNosInTeam.includes(rollUp)) {
                return res.status(400).json({ success: false, error: `Duplicate roll number within team: ${rollUp}` });
            }
            rollNosInTeam.push(rollUp);
            members[i].rollNo = rollUp;
            if (i === 0) {
                members[i].isLead = true;
                if (!m.email || !m.phone) {
                    return res.status(400).json({ success: false, error: 'Team lead email and phone are required.' });
                }
            }
        }

        // ── DB duplicate roll check ───────────────────────────────
        for (const roll of rollNosInTeam) {
            const exists = await Team.findOne({ 'members.rollNo': roll });
            if (exists) {
                return res.status(400).json({
                    success: false,
                    error: `Roll number ${roll} is already registered in another team. A student cannot be part of two teams.`,
                });
            }
        }

        // ── Registration closed check ─────────────────────────────
        const now = new Date();
        const regOpen = new Date('2026-03-13T00:00:00+05:30');
        const regClose = new Date('2026-03-17T23:59:59+05:30');
        if (now < regOpen || now > regClose) {
            return res.status(400).json({ success: false, error: 'Registration is not currently open.' });
        }

        // ── Save team ─────────────────────────────────────────────
        const team = new Team({ teamName: teamName.trim(), track, problemStatement: problemStatement.trim(), members });
        await team.save();

        // ── Send confirmation email ───────────────────────────────
        const lead = members.find(m => m.isLead) || members[0];
        if (process.env.EMAIL_USER && lead.email) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST,
                    port: Number(process.env.EMAIL_PORT),
                    secure: false,
                    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
                });
                await transporter.sendMail({
                    from: `"HackBattle 2026" <${process.env.EMAIL_USER}>`,
                    to: lead.email,
                    subject: `🚀 Registration Confirmed — ${team.registrationId} | HackBattle 2026`,
                    html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <h2 style="color:#ff5c1a;">HackBattle 2026 — Registration Confirmed!</h2>
              <p>Hi <strong>${lead.name}</strong>,</p>
              <p>Your team <strong>${team.teamName}</strong> has been successfully registered for <strong>HackBattle 2026</strong>.</p>
              <p><strong>Registration ID:</strong> <code style="background:#f4f4f4;padding:2px 8px;border-radius:4px;">${team.registrationId}</code></p>
              <p><strong>Track:</strong> ${team.track}</p>
              <hr>
              <p style="color:#555;">Event: 18th March 2026, 11:00 AM — Vishveshwarya Group of Institutions</p>
              <p style="color:#555;">Organised by Ignite Club · Team BugByte</p>
            </div>
          `,
                });
            } catch (_) { /* Email failure is non-blocking */ }
        }

        return res.status(201).json({
            success: true,
            registrationId: team.registrationId,
            message: 'Registration successful! Check your email for confirmation.',
            team: { teamName: team.teamName, track: team.track, members: team.members, registrationId: team.registrationId },
        });
    } catch (err) {
        if (err.code === 11000) {
            // Mongo duplicate key
            const field = Object.keys(err.keyPattern || {})[0] || '';
            if (field.includes('rollNo')) {
                return res.status(400).json({ success: false, error: 'One or more roll numbers are already registered in another team.' });
            }
            if (field === 'teamName') {
                return res.status(400).json({ success: false, error: 'A team with this name already exists. Please choose a different team name.' });
            }
        }
        console.error(err);
        return res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
    }
});

module.exports = router;
