var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET request for devs to see all of the current users */
router.get('/allusers', function(req, res) {
    var users = req.users;
    var usersString = '';
    for (var i = 0, n = users.length; i < n; i++) {
        var user = users[i];
        usersString += user.username + ', ';
    }
    res.status(200).json({users: usersString.substring(0, usersString.length - 2)});
});

/* GET Sign Up page. */
router.get('/signup', function(req, res) {
    res.render('signup');
});

/* GET Log In page. */
router.get('/loginpage', function(req, res) {
    res.render('login');
});

/* GET Delete page. */
router.get('/delete', function(req, res) {
    res.render('delete');
});

/* POST to adduser Service */
router.post('/adduser', function(req, res) {

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    
    var users = req.users;
    var secretKey = req.secretKey;
    
    for (var i = 0, n = users.length; i < n; i++) {
        if (users[i].username === userName) {
            res.status(400).json('Username is already in use! Please return to the signup page.');
            return;
        }
        if (users[i].email === userEmail) {
            res.status(400).json('Email is already in use! Please return to the signup page.');
            return;
        }
    }
    
    var token = jwt.sign({password: userPassword}, secretKey);
    
    var newUser = {username: userName, email: userEmail, password: userPassword, userJWT: token};
    users.push(newUser);
    console.log(JSON.stringify(users));
    var userStuff = JSON.stringify({username: userName, isLoggedIn: true, token: token, loggedIn: true});
    
    res.cookie('userInfo', encodeURI(userStuff), {maxAge: 86400/*one day in seconds*/, httpOnly: false});
    res.redirect('/');
});

/* POST to login Service */
router.post('/login', function(req, res) {
   var usernameOrEmail = req.body.usernameOrEmail;
   var password = req.body.password;
   
   var users = req.users;
   var secretKey = req.secretKey;
   
   var noUsernameMatch = true;
   
   var n = users.length;
   
   for (var i = 0; i < n; i++) {
       var u = users[i];
       if (u.username === usernameOrEmail || u.email === usernameOrEmail) {
           noUsernameMatch = false;
       }
   }
   
   if (noUsernameMatch) {
       res.status(400).json('Couldn\'t find an account with the provided username or email.');
       return;
   }
   
   for (var i = 0; i < n; i++) {
       if (users[i].username === usernameOrEmail || users[i].email === usernameOrEmail) {
           var user = users[i];
            jwt.verify(user.userJWT, secretKey, function(error, decoded) {
               if (error) {
                   console.log('Some error occured. Possibly a bad secret key.');
                   res.status(500);
               }
               if (decoded.password === password) {
                   var userStuff = JSON.stringify({username: user.username, isLoggedIn: true, token: user.userJWT});
                   res.cookie('userInfo', userStuff, {maxAge: 86400/*one day in seconds*/, httpOnly: false}).redirect('/');
               } else {
                   res.status(400).json('Incorrect username or password.');
               }
           });
       }
   }
});

/* POST to logout Service */
router.get('/logout', function(req, res) {
    res.cookie('userInfo', '', {maxAge: 86400/*one day in seconds*/, httpOnly: false});
    res.redirect('/');
});

/* POST to delete account Service */
router.post('/deleteaccount', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var users = req.users;
    var secretKey = req.secretKey;
    var noUsernameMatch = true;
   
    var n = users.length;
   
    for (var i = 0; i < n; i++) {
        var u = users[i];
        if (u.username === username) {
            noUsernameMatch = false;
        }
    }
   
    if (noUsernameMatch) {
        res.status(400).json('Couldn\'t find an account with the provided username or email.');
        return;
    }
    
    for (var i = 0; i < n; i++) {
       if (users[i].username === username) {
           var user = users[i];
           jwt.verify(user.userJWT, secretKey, function(error, decoded) {
               if (error) {
                   console.log('Some error occured. Possibly a bad secret key.');
                   res.status(500);
               }
               if (decoded.password === password) {
                   res.cookie('userInfo', '', {maxAge: 86400/*one day in seconds*/, httpOnly: false});
                   users.splice(users.indexOf(user), 1);
                   console.log(JSON.stringify(users));
                   res.redirect('/');
               } else {
                   res.status(400).json('Incorrect username or password.');
               }
           });
       }
   }
});

module.exports = router;
