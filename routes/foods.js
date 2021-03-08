const express = require('express');
const router = express.Router();
const verify = require('../public/javascripts/verifyToken');
const FoodService = require("../services/FoodService");

router.get('/', verify, async (req, res) => {
    try {
        const foods = await new FoodService().getFood()
        res.render('foods/index', {
            foods: foods
        })
    } catch  {
        res.redirect('/');
    }
});

router.get('/new', verify, (req, res) => {
    try {
    food = new FoodService().emptyFood()
    res.render('foods/new', {food: food})
    } catch {
        res.redirect('/');
    }
})

router.post('/new',  verify, async (req,res) => {
    const {name, fats, carbs, protein, fiber} = req.body
    try {
        const newFood = await new FoodService().createFood(name, fats, carbs, protein, fiber)
        res.redirect(`/foods/${newFood.slug}`)
    } catch {
        res.redirect('/');
    }
})

router.get('/search/', verify, async (req, res) => {
    try {
        const food = await new FoodService().getFood({_id: req.query.id})
        res.redirect(`/foods/${food.slug}`)
    } catch {
        res.redirect('/')
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

router.get('/:slug', verify, async (req, res) => {
    try {
        const foodService = new FoodService()
        const foods = await foodService.getFood()
        const food = await foodService.getFood({slug: req.params.slug})
        res.render('foods/show', {food:food, foods:foods})
    } catch {
        res.redirect('/')
    } 
})

router.get('/:slug/edit', verify, async (req, res) => {
    try {
        const food = await new FoodService().getFood({slug: req.params.slug})
        res.render('foods/edit', {food: food})
    } catch {
        res.redirect('/')
    }
})

router.put('/:id', verify, async (req, res) => {
    try {
        const food = await new FoodService().updateFood(req.params.id, req.body)
        res.redirect(`/foods/${food.slug}`)
    } catch {
        res.redirect('/')
    }
    
})

router.delete('/:id', verify, async (req, res) => {
    try {
        await new FoodService().deleteFood(req.params.id)
        res.redirect('/foods')
    } catch {
        res.redirect('/')
    }
})

module.exports = router;