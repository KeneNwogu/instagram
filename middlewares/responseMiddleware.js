exports.addJsonHeader = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    next();
}
