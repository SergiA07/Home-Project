const mongoose = require('mongoose')
const slugify = require('slugify')

const ingredientSchema = new mongoose.Schema({
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
    },
    quantity: Number
})

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  /* updateDate: {
    type: Date,
    required: true
  }, */
  ingredients: [ingredientSchema],
  slug: {
    type: String,
    required: true,
    unique: true
    }
})

dishSchema.pre('validate', function(next) {
    if (this.name) {
        this.slug = slugify(this.name, {lower: true, strict: true})
    }
    next()
})

module.exports = mongoose.model('Dish', dishSchema)