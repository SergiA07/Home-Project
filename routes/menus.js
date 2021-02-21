const express = require('express');
const router = express.Router();
const Dish = require('../models/dish');
const Food = require('../models/food');
const Menu = require('../models/menu');
const User = require('../models/user');
const verify = require('../public/javascripts/verifyToken')

router.get('/', verify, async (req,res) => {
    try {
        const user = await User.findOne({ _id: req.user.user_id})
        const menus = await Menu.find()
                            .populate('meals.meal')
                            .exec()
        res.locals.loggedInUser = user.username                    
        res.render('menus/index', {
            menus: menus
        })
    } catch {
        res.redirect('/');
    }
})

router.get('/new', async (req, res) => {
    try {
        const menu = new Menu()
        renderNewPage(res, menu)
    } catch {
        res.redirect('/')
    }
})

router.post('/new', async (req, res) => {
    const meals = getMeals(req.body)
    const date = getDate(req.body.scheduledDate)
    const menu = new Menu({
        meals: meals,
        date: date
    })
    if (req.body.createButton != null) {
        try {
            const newMenu = await menu.save()
            res.redirect(`/menus/${newMenu.slug}`)
        } catch {
            renderNewPage(res, menu, true)
        }
    } else {
        renderNewPage(res, menu, false)
    }
})
    
router.get('/:slug', async (req, res) => {
    renderShowPage(req.params.slug, res)
})

router.get('/:slug/edit', async (req, res) => {
    try {
        const menu = await Menu.findOne({ slug: req.params.slug })
        renderEditPage(res, menu)
    } catch {
        res.redirect('/')
    }
})

router.put('/:id', async (req, res) => {
    const meals = getMeals(req.body)
    const date = getDate(req.body.scheduledDate)
    let menu
    try {
      menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {new: true})
      menu.meals = meals
      menu.date = date
      if (req.body.updateButton != null) {
        await menu.save()
        res.redirect(`/menus/${menu.slug}`)
      } else {
        renderEditPage(res, menu, true)
      }
    } catch {
        if (menu != null) {
            renderEditPage(res, menu, true)
        } else {
            res.redirect('/')
        }
    }
})

router.delete('/:id', async (req,res) => {
    try {
        await Menu.findByIdAndDelete(req.params.id)
        res.redirect('/menus')
    } catch {
        renderShowPage(req.params.slug, res, true)
    }
})

/////////////

async function renderNewPage(res, menu, hasError = false) {
    renderFormPage(res, menu, 'new', hasError)
}

async function renderEditPage(res, menu, hasError = false) {
    renderFormPage(res, menu, 'edit', hasError)
}

async function renderFormPage(res, menu, form, hasError = false) {
    try {
        const foods = await Food.find()
        const dishes = await Dish.find()
        const params = {
        foods: foods,
        dishes: dishes,
        menu: menu
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Dish'
            } else {
                params.errorMessage = 'Error Creating Dish. Check if a menu for the day already exists'
            }
        } 
        res.render(`menus/${form}`, params)
    } catch {
        res.redirect('/')
    }
}

async function renderShowPage(slug, res, errorDeleting = false) {
    try {
        const menu = await Menu.findOne({slug: slug})
                              .populate('meals.meal')
                              .exec()
        params = {
            menu: menu
        }  
        if (errorDeleting) { params.errorMessage = 'Could not remove menu' }
        res.render('menus/show', params)
    } catch {
        res.redirect('/')
    }
}

/////////////

function getMeals(body) {
    let meals = []
    dishes = []
    let numberOfDishes = 0
    foods = []
    let numberOfFoods = 0
    const dishRegex = /dish([0-9]+)/
    const foodRegex = /food([0-9]+)/
    Object.keys(body).forEach(element => {
        const matchDish = dishRegex.exec(element)
        const matchFood = foodRegex.exec(element)
            if (matchDish) {
                numberOfDishes = numberOfDishes + 1
                dishes.push(element)
            } else if (matchFood) {
                numberOfFoods = numberOfFoods + 1
                foods.push(element)
            }
    })
    let allMeals = dishes.concat(foods)
    allMeals.forEach((element, index) => {
        if (index < dishes.length) {
            let meal = {
                meal: body[element],
                onModel: 'Dish'
            }
            meals.push(meal)
        }   else {
            let meal = {
                meal: body[element],
                quantity: body['foodQuantity'+element.slice(4)],
                onModel: 'Food'
            }
            meals.push(meal)
        }
    })
    if (meals.length > 1) {
        const eraseRegex = /eraseButton([0-9]+)/
        Object.keys(body).forEach(element => {
            const match = eraseRegex.exec(element)
            if (match) {
                 const eraseMatch = match[1]
                 meals.splice(parseInt(eraseMatch),1)
            }
        })
    }
    if (body.plusDishButton != null) {
        meals.push({onModel: 'Dish'})
    }
    if (body.plusFoodButton != null) {
        meals.push({onModel: 'Food'})
    }
    return meals
}

function getDate(date) {
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let dayOfWeek = new Date(date).getDay(); 
    if (!isNaN(dayOfWeek) && dayOfWeek != null) dayOfWeek = weekDays[dayOfWeek]
    let dateObject = {
        longDate: new Date(date),
        dayOfWeek: dayOfWeek
    }
    return dateObject
}

module.exports = router