const express = require('express')
const router = express.Router()
const User = require('../models/user');
const verify = require('../public/javascripts/verifyToken')

router.get('/info', verify, async (req, res) => {
    try {
        await User.findOne({ _id: req.user.user_id}, (error, user) => {
            if(error) console.log(error)
            res.locals.loggedInUser = user.username
            res.render('users/show', {user: user})
        })
    } catch {
        res.redirect('/')
    }
})

module.exports = router