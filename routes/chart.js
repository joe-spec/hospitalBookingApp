const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth');
const Patient = require('../models/patient');
const Booking = require('../models/booking')

router.get('/', (req, res) => {
    res.render('chart');
})


module.exports = router;