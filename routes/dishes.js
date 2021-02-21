const express = require('express');
const router = express.Router();
const Dish = require('../models/dish');
const Food = require('../models/food');
const verify = require('../public/javascripts/verifyToken')
//const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

router.get('/', verify, async (req,res) => {
    try {
        const dishes = await Dish.find();
        res.render('dishes/index', {
            dishes: dishes
        })
    } catch {
        res.redirect('/');
    }
})

router.get('/new', async (req, res) => {
    let dish = new Dish()
    dish.ingredients = [{}]
    renderNewPage(res, dish)
})

router.post('/new', async (req, res) => {
    const ingredients = getIngredients(req.body)
    const dish = new Dish({
      name: req.body.name,
      ingredients: ingredients,
      updateDate: new Date(req.body.updateDate),
      description: req.body.description
    })
    if (req.body.createButton != null) {
        try {
        const newDish = await dish.save()
        res.redirect(`/dishes/${newDish.slug}`)
        } catch {
        renderNewPage(res, dish, true)
        }
    } else {
        renderNewPage(res, dish, false)
    }
})

router.get('/search/', async (req, res) => {
    try {
        const dish = await Dish.findById(req.query.id)
        res.redirect(`/dishes/${dish.slug}`)
    } catch {
        res.redirect('/')
    }
})

// TO DO
router.get('/advancedSearch', async (req, res) => { 
    let query = Dish.find()
    if (req.query.title != null && req.query.title != '') {
      query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
      query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
      query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
      const dishes = await query.exec()
      res.render('dishes/index', {
        dishes: dishes,
        searchOptions: req.query
      })
    } catch {
      res.redirect('/')
    }
})
  
router.get('/:slug', async (req, res) => {
    renderShowPage(req.params.slug, res)
})

router.get('/:slug/edit', async (req, res) => {
    try {
        const dish = await Dish.findOne({ slug: req.params.slug })
        renderEditPage(res, dish)
    } catch {
        res.redirect('/')
    }
})

router.put('/:id', async (req, res) => {
    ingredients = getIngredients(req.body)
    let dish
    try {
      dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {new: true})
      dish.ingredients = ingredients
      if (req.body.updateButton != null) {
        await dish.save()
        res.redirect(`/dishes/${dish.slug}`)
      } else {
        renderEditPage(res, dish, true)
      }
    } catch {
        if (dish != null) {
            renderEditPage(res, dish, true)
        } else {
            res.redirect('/')
        }
    }
})

router.delete('/:id', async (req,res) => {
    try {
        await Dish.findByIdAndDelete(req.params.id)
        res.redirect('/dishes')
    } catch {
        renderShowPage(req.params.slug, res, true)
    }
})

////// RENDER FUNCTIONS

async function renderNewPage(res, dish, hasError = false) {
    renderFormPage(res, dish, 'new', hasError)
}

async function renderEditPage(res, dish, hasError = false) {
    renderFormPage(res, dish, 'edit', hasError)
}

async function renderFormPage(res, dish, form, hasError = false) {
    try {
        const foods = await Food.find()
        const params = {
        foods: foods,
        dish: dish
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Dish'
            } else {
                params.errorMessage = 'Error Creating Dish'
            }
        } 
        res.render(`dishes/${form}`, params)
    } catch {
        res.redirect('/')
    }
}

async function renderShowPage(slug, res, errorDeleting = false) {
    try {
        const dishes = await Dish.find()
        const dish = await Dish.findOne({slug: slug})
                              .populate('ingredients.food')
                              .exec()
        params = {
            dish: dish,
            dishes: dishes
        }
        if (errorDeleting) { params.errorMessage = 'Could not remove dish' } 
        res.render('dishes/show', params)
    } catch {
        res.redirect('/')
    }
}

//// OTHER FUNCTIONS

function getIngredients(body) {
   const regex = /ingredientText([0-9]+)/
   let numberOfFoods = 0
   Object.keys(body).forEach(element => {
    const match = regex.exec(element)
        if (match) {
            numberOfFoods = numberOfFoods + 1
        }
   })
   let ingredients = []
    Array.from(Array(parseInt(numberOfFoods)).keys()).forEach((element,index) => {
        let ingredient = {
            food: body['ingredientText'+index],
            quantity: body['ingredientNumber'+index]
        };
        ingredients.push(ingredient)
    })
    if (ingredients.length > 1) {
        const regex2 = /eraseButton([0-9]+)/
        Object.keys(body).forEach(element => {
            const match = regex2.exec(element)
            if (match) {
                const eraseMatch = match[1]
                ingredients.splice(parseInt(eraseMatch),1)
            }
        })
    }
    if (body.plusButton != null) {
        ingredients.push({})
    }
    return ingredients
}

function saveCover(book, coverEncoded) {
if (coverEncoded == null) return
const cover = JSON.parse(coverEncoded)
if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
    }
}
  
module.exports = router