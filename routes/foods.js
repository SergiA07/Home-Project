const express = require('express');
const router = express.Router();
const Food = require('../models/food');
const Dish = require('../models/dish');
const verify = require('../public/javascripts/verifyToken')


router.get('/', verify, async (req, res) => {
    try {
        const foods = await Food.find();
        res.render('foods/index', {
            foods: foods
        })
    } catch {
        res.redirect('/');
    }
});

router.get('/new', verify, (req, res) => {
    renderNewPage(res, new Food())
})

router.post('/new',  verify, async (req,res) => {
    const food = new Food({
        name: req.body.name,
        fats: req.body.fats,
        carbs: req.body.carbs,
        protein: req.body.protein,
        fiber: req.body.fiber
    })
    try {
        const newFood = await food.save()
        res.redirect(`/foods/${newFood.slug}`)
    } catch {
        renderNewPage(res, food, true)
    }
})

router.get('/search/',  verify, async (req, res) => {
    try {
        const food = await Food.findById(req.query.id)
        res.redirect(`/foods/${food.slug}`)
    } catch {
        res.redirect('/')
    }
})

router.get('/advancedSearch',  verify, async (req, res) => {
    let query = Food.find()
    let searchStarted = true
    if (req.query.name != null && req.query.name != '') {
      query = query.regex('name', new RegExp(req.query.name, 'i'))
      searchStarted = false
    }
    if (req.query.fats != null && req.query.fats != '') {
      query = query.lte('fats', req.query.fats)
      searchStarted = false
    }
    if (req.query.carbs != null && req.query.carbs != '') {
      query = query.gte('carbs', req.query.carbs)
      searchStarted = false
    }
    try {
      let foods
      if(searchStarted) { foods = [] } else {
        foods = await query.exec()
      } 
      res.render('foods/advancedSearch', {
        foods: foods,
        searchOptions: req.query,
      })
    } catch {
      res.redirect('/')
    }
})

router.get('/:slug', verify, async (req, res) => {
    renderShowPage(req.params.slug, res)
})

router.get('/:slug/edit', async (req, res) => {
    try {
        const food = await Food.findOne({ slug: req.params.slug })
        renderEditPage(res, food)
    } catch {
        res.redirect('/')
    }
})

router.put('/:id', verify, async (req, res) => {
    let food
    try {
        food = await Food.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.redirect(`/foods/${food.slug}`)
    } catch {
        if (food != null) {
            renderEditPage(res, food, true)
        } else {
            res.redirect('/')
        }
    }
})

router.delete('/:id', verify, async (req, res) => {
    let food
    try {
        food = await Food.findById(req.params.id)
        await food.remove()
        res.redirect('/foods')
    } catch (e) {
        renderShowPage(food.slug, res, e.message)
    }
})

////// RENDER FUNCTIONS

async function renderNewPage(res, food, hasError = false) {
    renderFormPage(res, food, 'new', hasError)
}

async function renderEditPage(res, food, hasError = false) {
    renderFormPage(res, food, 'edit', hasError)
}

async function renderFormPage(res, food, form, hasError = false) {
    try {
        const params = {
        food: food
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Food'
            } else {
                params.errorMessage = 'Error Creating Food'
            }
        } 
        res.render(`foods/${form}`, params)
    } catch {
        res.redirect('/')
    }
}

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

module.exports = router;