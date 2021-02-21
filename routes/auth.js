const express = require('express')
const router = express.Router()
const User = require('../models/user');
const {registerValidation, loginValidation} = require('../public/javascripts/validation') 
const jwt = require('jsonwebtoken');
const { localsName } = require('ejs');

router.get('/register', async (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    const {error} = registerValidation(req.body)
    if(error) return res.render('register', {userRegisterError: error.details[0].message})
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    try {
        await user.save((error, newUser) => {
            if(error) {
                if(error.name === 'MongoError' && error.code === 11000) {
                    if(error.keyPattern.slug != undefined) {
                        return res.render('register', {userRegisterError: 'Username already exist!'})
                    } else if(error.keyPattern.email != undefined) {
                        return res.render('register', {userRegisterError: 'Email already exist!'})
                    }
                } else {
                    return res.render('register', {userRegisterError: 'Unexpected error registering User'})
                }
            }
        res.redirect('login')    
        })
    } catch {
        res.redirect('register')
    }
})

router.get('/login', async (req, res) => {
    res.render('login');
    //res.render('login', {userLoginError: null})
})

router.post('/login', async (req, res) => {
    const {error} = loginValidation(req.body)
    if(error) return res.render('login', {userLoginError: error.details[0].message})
    try {
        const user = await User.findOne({ username: req.body.username })
        if(user == null) {
            return res.render('login', {userLoginError: 'Username not valid'})
        }
        if(await user.comparePassword(req.body.password)) {
            jwt.sign(
                //user._id.toJSON(),
                { user_id: user._id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "3000s" },
                (error, accesstoken) => {
                    if (error) console.log(error)
                    res.cookie('accessToken', accesstoken, {httpOnly: true}).redirect('/users/info')
                    //res.json({accesstoken})
                })
        } else {
            return res.render('login', {userLoginError: 'Password incorrect'})
        }
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

router.get('/logout', (req,res) => {
    res.clearCookie('accessToken')
    res.redirect('login')
})

////

module.exports = router