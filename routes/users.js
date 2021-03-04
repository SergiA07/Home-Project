const express = require('express')
const router = express.Router()
const User = require('../models/user');
const Menu = require('../models/menu');
const verify = require('../public/javascripts/verifyToken')


router.get('/', verify, async (req, res) => {
    try {
        await User.findOne({ _id: req.user.user_id}, (error, user) => {
            redirect(`/users/${user.slug}`)
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:slug', verify, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.user_id})
        let date = new Date();
        date.setDate(date.getDate()-1)
        const menu = await Menu.findOne({user: user.id, "date.longDate": {$gte: date}})
                                .sort({"date.longDate": "1"})
                                .populate('meals.meal')
        res.render('users/show', {user: user, menu: menu})
    } catch {
        res.redirect('/')
    }
})

router.get('/:slug/info', verify, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.user_id})
        res.render('users/info', {user: user})
    } catch  {
        res.redirect('/')
    }
})

router.get('/:slug/edit', verify, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.user_id})
        res.render('users/edit', {user: user})
    } catch {
        res.redirect('/')
    }
})

router.put('/:id', verify, async (req, res) => {
    let user
    try {
      user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
      res.redirect(`/users/${user.slug}`)
    } catch {
        if (user != null) {
            res.render('users/edit', {errorMessage: 'Error Updating User'})
        } else {
            res.redirect('/')
        }
    }
})

//////////

async function renderShowPage(slug, res, errorDeleting = undefined) {
    try {
        const foods = await Food.find()
        const food = await Food.findOne({ slug: slug })
        params = {
            food: food,
            foods: foods
        }  
        if (errorDeleting != undefined) { 
            params.errorMessage = 'Error Deleting Food: '+ errorDeleting } 
        res.render('foods/show', params)
    } catch {
        res.redirect('/')
    }
}

module.exports = router