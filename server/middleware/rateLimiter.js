const rateLimit = require('express-rate-limit');

const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { success: false, error: 'Too many registration attempts from this IP. Please try again after an hour.' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { registrationLimiter };
