const mongoose = require('mongoose');
const Dish = require('./dish')
const slugify = require('slugify')

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fats: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    fiber: {
        type: Number,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
})

foodSchema.pre('remove', async function(next) {
    let dishes = await Dish.find({['ingredients.food'] : this.id}).exec()
    try {
        if (dishes.length > 0) {
            next(new Error('This Food has Dishes still'))
        } else {
            next()
        }
    } catch (e) {
        next(e)
    }
})

foodSchema.pre('validate', function(next) {
    if (this.name) {
        this.slug = slugify(this.name, {lower: true, strict: true})
    }
    next()
})

module.exports = mongoose.model('Food', foodSchema);