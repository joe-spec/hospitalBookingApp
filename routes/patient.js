const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')
// const { ensureAuthenticated } = require('../config/auth');
const Patient = require('../models/patient');
const BookAppointment = require('../models/booking');


//signin page
router.get('/signin', (req, res) => res.render('signin'));

//signup page
router.get('/signup', (req, res) => res.render('signup'));

//register handle
router.post('/signup', (req, res) => {
    const { firstname, lastname, othername, email, bloodGroup, password, password2, isAdmin } = req.body;
    let errors = [];

    //check require field
    if (!firstname || !lastname || !email || !bloodGroup || !password || !password2 || !isAdmin) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    //check passwors match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match, try again' });
    }

    //check passwords length
    if (password.length < 8) {
        errors.push({ msg: 'Password must be atleast eight characters long' });
    }

    if (errors.length > 0) {
        res.render('signup', {
            errors, firstname, lastname, othername, email, bloodGroup, password, password2, isAdmin
        });
    } else {
        //validation pass
        Patient.findOne({ email: email })
            .then(patient => {
                if (patient) {
                    //user exist
                    errors.push({ msg: 'A patient exist with same Email, use a different one' })
                    res.render('signup', {
                        errors, firstname, lastname, othername, email, bloodGroup, password, password2, isAdmin
                    });
                } else {
                    const newPatient = new Patient({
                        firstname, lastname, othername, email, bloodGroup, password, isAdmin
                    });
                    //hash password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newPatient.password, salt, (err, hash) => {
                            if (err) throw err;
                            newPatient.password = hash;
                            newPatient.save().then(patient => {
                                req.flash('success_msg', "you have been Registered successfully, you can now signin")
                                res.redirect('/patient/signin')
                            }).catch(err => {
                                console.log(err)
                            });
                        })
                    })
                }
            });
    }
});

//login handle
router.post('/signin', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/patient/profile',
        failureRedirect: '/patient/signin',
        failureFlash: true
    })(req, res, next);
});

//logout handle
router.get('/signout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Bye for now, Do stay Healthy');
    res.redirect('/patient/signin');
})

//profile page
router.get('/profile', (req, res) => {
    BookAppointment.find({}, (err, appointment) => {
        res.render('profile', {
            patient: req.patient,
            appointment: appointment
        })
    })
});

module.exports = router;