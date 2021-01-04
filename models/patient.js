const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    firstname:{
        type: String,
    },
    lastname:{
        type: String,
    },
    othername:{
        type: String,
    },
    email:{
        type: String,
    },
    bloodGroup:{
        type: String,
    },
    password:{
        type: String,
    },
    isAdmin:{
        type: Boolean,
    },
    date:{
        type: Date,
        default: Date.now()
    }
});

// module.exports = { 
//     Patient: mongoose.model('Patient', PatientSchema)
// };
let Patient = module.exports = mongoose.model('Patient', PatientSchema)