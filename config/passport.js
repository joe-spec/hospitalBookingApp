const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

//user model
const Patient = require('../models/patient');

//passport setting up
module.exports = function(passport){
    passport.use(new LocalStrategy({
        usernameField:'email',
        passReqToCallback: true
    }, async(req,email,password,done) =>{
        await Patient.findOne({email:email}).then(async patient => {
            if(!patient){
                return done(null, false, {message: 'Sorry I do not know you. Check your email or Signup'});
            }
            bcrypt.compare(password, patient.password, function (err, isMatch) {
                if (err) {
                    return err;
                }
                if (!isMatch) {
                    return done(null, false, { message: 'Your password is incorrect' });
                }
                return done(null, patient, req.flash('success_msg', `Welcome ${patient.firstname} ${patient.lastname}`));
            })
        }).catch(err =>{console.log(err)});
    } ));
    
    //seiallize patient
    passport.serializeUser(function(patient, done){
        done(null, patient.id)
    });
    
    //deseiallize patient
    passport.deserializeUser(function(id, done){
        Patient.findById(id, function(err, patient){
            done(err,patient);
        });
    });
}




// const LocalStrategy = require('passport-local').Strategy;
// const Patient = require('../models/patient');
// // const config = require('../config/database');
// const bcrypt = require('bcryptjs');

// module.exports = function(passport){
//     // local strategy
//     passport.use(new LocalStrategy(function(email, password, done){
//         //match email
//         let query = {email:email};
//         Patient.findOne(query, function(err, patient){
//             if(err) throw err;
//             if(!patient){
//                 return done(null, false, {message: 'Sorry I do not know you. Check your email or Signup'});
//             }
//             //match password
//             bcrypt.compare(password, patient.password, function(err, isMatch){
//                 if(err) throw err;
//                 if(isMatch){
//                     return done(null, patient);
//                 }else{
//                     return done(null, false, {message: 'Your password is incorrect'});
//                 }
//                 // return done(null, patient, req.flash('success-message',`Welcome ${patient.firstname}`));
//             })
//         })
//     })); 

//     passport.serializeUser(function(patient, done){
//         done(null, patient.id);
//     });
    
//     passport.deserializeUser(function(id, done){
//         Patient.findById(id, function(err, patient){
//             done(err, patient);
//         })
//     })
// }