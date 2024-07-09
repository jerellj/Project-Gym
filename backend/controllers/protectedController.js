exports.getProtectedData = (req, res) => {
    res.status(200).json({ message: 'This is protected data', user: req.user });
};