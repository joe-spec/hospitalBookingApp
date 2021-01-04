const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
    name:{
        type: String,
    },
    // email:{
    //     type: String,
    // },
    department:{
        type: String,
    },
    appointmentDate:{
        type: String,
    },
    date:{
        type: Date,
        default:Date.now
    }
});

let Booking = module.exports = mongoose.model('Booking', BookingSchema);