const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    const {cookies} = req
    if(!('accessToken' in cookies)) return res.redirect('/auth/login')
    try {
        const verified = jwt.verify(cookies.accessToken, process.env.ACCESS_TOKEN_SECRET)
        req.user = verified
        next()
    } catch (error) {
        if(error.name === 'TokenExpiredError') {
            res.render('login', { userLoginError: 'Session expired. Log in.'})
        } else {
            res.redirect('/auth/login')
        } 
    }
}