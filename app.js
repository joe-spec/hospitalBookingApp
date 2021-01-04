const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require("morgan");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const ejs = require('ejs')
const expressEjsLayouts = require('express-ejs-layouts')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = 8000
let client = 0

//connecting database
mongoose.connect('mongodb://localhost/hospitalBookingApp',{
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then((res) => {
    console.log('connected to hospital booking database')
}).catch((err) => {
    console.log(err)
});

io.on('connection', function(socket) {
    socket.on('NewClient', ()=>{
        if(clients < 2){
            if(clients == 1){
                this.exit('CreatePeer')
            }
        }else{
            this.emit('SessionActive')
        }
    })
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('disconnet', Disconnect)
})

function Disconnect(){
    if(clients > 0){
        clients--
    }
}

function SendOffer(offer){
    this.broadcast.emit('BackOffer', offer)
}

function SendAnswer(data){
    this.broadcast.emit('BackAnswer', data)
}

//initiallizing ejs
app.use(expressEjsLayouts)
app.set('view engine', 'ejs')

// LOGGER INIT
app.use(logger("dev"));

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//express session midleware
app.use(session({
    secret: '({[<>}])',
    saveUninitialized: false, //if saved to true tis session will be saved on the server on each request no matter if something change or not
    resave: false,
    cookie: { maxAge:Date.now() + 3600000}
}));

//initiallize passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variable
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    // res.locals.isAuthenticated = req.patient ? true : false; //tanary oprerator
    // res.locals.patient = req.patient || null;
    next();
})

//set public folder/ static files
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/patient', require('./routes/patient'))
app.use('/chart', require('./routes/chart'))


app.listen(port, () => {console.log(`Server Is Listening Happily On Port ${port}`)})