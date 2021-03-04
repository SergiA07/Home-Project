const express = require('express');
const router = express.Router();
const User = require('../models/user')
const verify = require('../public/javascripts/verifyToken')

router.get('/', verify, (req, res) => {
    redirect('/users')
})

module.exports = router;