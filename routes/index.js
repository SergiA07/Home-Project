const express = require('express');
const router = express.Router();
const Dish = require('../models/dish')

router.get('/', async (req, res) => {
    let dishes
    try {
        dishes = await Disch.find().sort({ name: 'desc'}).limit(10).exec()
    } catch {
        dishes = []
    }
    res.render('index', {dishes: dishes});
});

module.exports = router;