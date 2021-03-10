const express = require('express');
const router = express.Router();
const verify = require('../public/javascripts/verifyToken');
const FoodService = require("../services/FoodService");
const createError = require('http-errors');
const mongoose = require('mongoose');

router.get('/', verify, async (req, res, next) => {
    try {
        const foods = await new FoodService().getFood()
        if(!foods) throw createError(404,'Could not get Foods Info')
        res.render('foods/index', {
            foods: foods
        })
    } catch (error)  {
        if(error instanceof mongoose.CastError) {
            next(createError(400, 'Invalid item Id'))
        }
        next(error)
    }
})

router.get('/new', verify, (req, res, next) => {
    try {
        food = new FoodService().emptyFood()
        if(!food) throw createError(404,'Error Creating Food')
        res.render('foods/new', {food: food})
    } catch (error)  {
        if(error instanceof mongoose.CastError) {
            next(createError(400, 'Invalid item Id'))
        }
        next(error)
    }
})

router.post('/new',  verify, async (req,res, next) => {
    const {name, fats, carbs, protein, fiber} = req.body
    try {
        const newFood = await new FoodService().createFood(name, fats, carbs, protein, fiber)
        if(!newFood) throw createError(404,'Error Creating Food')
        res.redirect(`/foods/${newFood.slug}`)
    } catch (error) {
        next(error)
    }
})

router.get('/search/', verify, async (req, res, next) => {
    try {
        const food = await new FoodService().getFood({_id: req.query.id})
        if(!food) throw createError(404,'Food does not exist')
        res.redirect(`/foods/${food.slug}`)
    } catch (error) {
        next(error)
    }
})

/*
router.get('/advancedSearch',  verify, async (req, res) => {  //TO DO
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
*/
router.get('/api/:slug', verify, async(req, res, next) => {
    try {
        const foodService = new FoodService()
        const data = await foodService.getFood({slug: req.params.slug})
        if(!data) throw createError(404,'Food does not exist')
        res.json(data)
    } catch (error) {
        next(error)
    } 
})


router.get('/:slug', verify, async (req, res, next) => {
    try {
        const foodService = new FoodService()
        const foods = await foodService.getFood()
        const food = await foodService.getFood({slug: req.params.slug})
        if(!food || !foods) throw createError(404,'Food does not exist')
        res.render('foods/show', {food:food, foods:foods})
    } catch (error) {
        if(error instanceof mongoose.CastError) {
            next(createError(400, 'Invalid item Id'))
            return
        }
        next(error)
    } 
})

router.get('/:slug/edit', verify, async (req, res, next) => {
    try {
        const food = await new FoodService().getFood({slug: req.params.slug})
        if(!food) throw createError(404,'Food does not exist')
        res.render('foods/edit', {food: food})
    } catch (error) {
        next(error)
    }
})

router.put('/:id', verify, async (req, res, next) => {
    try {
        const food = await new FoodService().updateFood(req.params.id, req.body)
        if(!food) throw createError(404,'Food does not exist')
        res.redirect(`/foods/${food.slug}`)
    } catch (error) {
        next(error)
    }
    
})

router.delete('/:id', verify, async (req, res, next) => {
    try {
        const result = await new FoodService().deleteFood(req.params.id)
        if(!result) throw createError(404,'Food does not exist')
        res.redirect('/foods')
    } catch (error) {
        next(error  )
    }
})

module.exports = router;