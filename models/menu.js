const mongoose = require('mongoose')
const slugify = require('slugify')
const Food = require('./food')
const Dish = require('./dish')
const User = require('./user')

const ingredientSchema = new mongoose.Schema({
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
    },
    quantity: Number
})

const menuSchema = new mongoose.Schema({
    date: {
        longDate: {type: Date, required: true},
        dayOfWeek: {type: String, required: true},
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    meals: [{
        meal: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'meals.onModel',
            required: true
        },
        quantity: {
            type: Number
        },
        onModel: {
            type: String,
            required: true,
            enum: ['Food', 'Dish'] 
        }
    }],
    slug: {
        type: String,
        required: true,
        unique: true
    }
})

menuSchema.pre('validate', function(next) {
    if (this.date.dayOfWeek) {
        this.slug = slugify(this.date.dayOfWeek+this.date.longDate.toISOString().split('T')[0], {lower: true, strict: true})
    }
    next()
})

 module.exports = mongoose.model('Menu', menuSchema)