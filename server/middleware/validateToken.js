const validateToken = (req, res, next) => {
    const { token } = req.params;
    if (token !== process.env.ADMIN_SECRET_TOKEN) {
        return res.status(404).json({ success: false, error: 'Not found.' });
    }
    next();
};

module.exports = validateToken;
