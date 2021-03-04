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

dishSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Dish', dishSchema)