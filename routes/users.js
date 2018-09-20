const express = require('express');
const router = express.Router();

var User = require('../models/user');
//register
router.get('/register',function (req,res) {
    res.render('register',{errors:0});
});
//login
router.get('/login',function (req,res) {
    res.render('login');
})
//register user
router.post('/register',function (req,res)
{
    var name= req.body.name;
    var email=req.body.email;
    var username=req.body.username;
    var password=req.body.password;
    var password2=req.body.password2;

    //validation
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Invalid email').isEmail();
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Confirm password is required').notEmpty();
    req.checkBody('password2','Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    console.log(errors);
    if(errors){
        res.render('register',{errors:errors});
    }
    else{
        var newUser = new User({
            name:name,
            username:username,
            email:email,
            password:password
        })
        User.createUser(newUser,function (err,user) {
            if (err) throw err;
            console.log(user);
        })
        req.flash('success_msg','You\'re registered and can now login');
        res.redirect('/user/login');
    }

});
module.exports = router;