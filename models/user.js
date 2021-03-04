const mongoose = require('mongoose');
const slugify = require('slugify')
const bcrypt = require('bcrypt');
const { number } = require('joi');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        unique: true,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        min: 6,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        min: 6,
        unique: true,
        required: true
    },
    weight: {
        type: Number,
        default: '70'
    },
    calories: {
        type: Number,
        default: '2500'
    }
})

userSchema.pre('validate', async function(next) {
    if (this.username) {
        this.slug = slugify(this.username, {lower: true, strict: true})
    }
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword = async function(passwordText) {
    return await bcrypt.compare(passwordText, this.password)
}

module.exports = mongoose.model('User', userSchema);

