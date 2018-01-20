var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var {users, addUser} = require('../models');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.post('/register', function(req, res) {
  
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  // Check if the pseudo or the email doesn t exists yet 

  // create a new User with pseudo, password and email
  addUser(req.body.pseudo, req.body.password, req.body.email);

  // si user existe deja 
  // envoie message d'erreur 
  // mail -> Cette adresse mail is already used 
  // user -> Ce pseudo est déja utilisé 
  // si erreur 
  // message d'erreur
  
  var token = jwt.sign({ id: req.body.pseudo }, config.secret, {
    expiresIn: 86400 // expires in 24 hours
  });
  res.status(200).send({ auth: true, token: token });
  // create a new User in the DB 

  // users.create({
  //     pseudo : req.body.pseudo,
  //     email : req.body.email,
  //     password : hashedPassword
  // },
  // function (err, user) {
  //     if (err) return res.status(500).send("There was a problem registering the user.")
  //     // create a token
  //     var token = jwt.sign({ id: user.pseudo }, config.secret, {
  //     expiresIn: 86400 // expires in 24 hours
  //     });
  //     res.status(200).send({ auth: true, token: token });
  // }); 
});

router.get('/me', function(req, res) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    // TODO find the user in the db then send it 
    // use decoded.id
    // omit the password 
    res.status(200).send(users);
  });
});

router.post('/login', function(req, res) {
  // User.findOne({ email: req.body.email }, function (err, user) {
  //   if (err) return res.status(500).send('Error on the server.');
  //   if (!user) return res.status(404).send('No user found.');
  //   var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
  //   if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
  //   var token = jwt.sign({ id: user._id }, config.secret, {
  //     expiresIn: 86400 // expires in 24 hours
  //   });
  //   res.status(200).send({ auth: true, token: token });
  // });
  if(!req.body.pseudo || !req.body.password){
    res.status(500).send('Please enter both id and password');
 } else {
   let userFound;
    users.filter(function(user){
       if(user.pseudo === req.body.pseudo && user.password === req.body.password){
          userFound = user
       }
    });
    if (userFound && userFound.password === req.body.password) {
      var token = jwt.sign({ id: userFound.pseudo }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
      res.status(200).send({ auth: true, token: token, user: userFound });
    } else {
      res.status(404).send('Not found or Wrong');
    }
 }
});

// AuthController.js
router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;