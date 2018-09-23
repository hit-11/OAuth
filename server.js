const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongodb = require('mongodb');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginapp');
const db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

//Init app
var app = express();

var engine = require('ejs-locals');
//Setting up view engine
app.engine('ejs',engine);
app.set('view engine','ejs');


//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false }));
app.use(cookieParser());

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Express Session
app.use(session({
    secret:'hpeswani',
    saveUninitialized:true,
    resave:true
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

//express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

//connect flash
app.use(flash());

//global vars
app.use(function (req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user=req.user || null;
    next();
});

app.use('/',routes);
app.use('/user',users);

//set port
app.set('port',(process.env.PORT || 3000));
app.listen(app.get('port'),function () {
    console.log("Server started on port" + app.get('port'));
});