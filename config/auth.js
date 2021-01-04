const Patient = require('../models/patient')
module.exports = {
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'hello dear, You need to SignIn first');
        res.redirect('/patient/signin');
    },

    // isAdmin: function(req,res,next){
    //     Patient.find({}, (err, patient)=>{
    //         if (patient.isAdmin !== false) {
    //             return next();
    //         }
    //         req.flash('error_msg', 'you are not an admin');
    //         res.redirect('/');
    //     })
    // }
}