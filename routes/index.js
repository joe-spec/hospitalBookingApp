const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth');
const Patient = require('../models/patient');
const Booking = require('../models/booking')

router.get('/', (req, res) => {
    Patient.find({}, (err, patient) => {
        res.render('home', {
            patient: req.patient,
            patient: patient
        });
    })
})

router.post('/', ensureAuthenticated, (req, res) => {
    let booking = new Booking();
    booking.name = req.body.name;
    // booking.email = req.body.email;
    booking.department = req.body.department;
    booking.appointmentDate = req.body.appointmentDate;

    booking.save().then(book => {
        req.flash('success_msg', 'Appointment Booked Successfully')
        res.redirect('/')
    }).catch(err => {
        console.log(err)
    });
})

module.exports = router;