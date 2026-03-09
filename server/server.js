require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/check-roll', require('./routes/rollcheck'));
app.use('/api/register', require('./routes/register'));
app.use('/api/admin', require('./routes/admin'));

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── 404 catch ──────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, error: 'Not found.' }));

// ── Error handler ──────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Internal server error.' });
});

// ── MongoDB ────────────────────────────────────────────────────────────────
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅  MongoDB connected');
        app.listen(PORT, () => {
            console.log(`🚀  Server running on http://localhost:${PORT}`);
            if (process.env.API_URL) {
                const cronJob = require('./cron');
                cronJob.start();
                console.log('⏰  Cron job started to ping:', process.env.API_URL);
            }
        });
    })
    .catch(err => { console.error('❌  MongoDB connection failed:', err.message); process.exit(1); });
