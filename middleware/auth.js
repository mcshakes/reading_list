module.exports.isUserAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({
            authenticated: false,
            message: "You must login first"
        })
    }
}