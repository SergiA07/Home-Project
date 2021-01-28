const mongoose = require('mongoose')
const Food = require('./food')
const Plat = require('./dish')

const platSchema = new mongoose.Schema({
    plat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plat'
    },
    quantity: Number
})

const foodSchema = new mongoose.Schema({
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
    },
    quantity: Number
})

const menuSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    date: {
      type: Date,
      required: true
    },
    plats: [platSchema],
    extras: [foodSchema]
})
  
  /*
  platSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
  })
  */
  module.exports = mongoose.model('Menu', menuSchema)