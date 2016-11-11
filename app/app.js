var express = require('express'),
  User = require('./models/User'),
  app = express(),
  mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/twitter-followers');

app.get('/', function (request, response) {
  console.log('123123123');
  response.send('hello world');

  chris.dudify(function (error, name) {
    console.log('Your new name is ' + name);

    if (error) {
      throw 'Error' + error;
    }

    console.log('Your new name is ' + name);
  });
});


// create a new user called chris
var chris = new User({
  name: 'Chris',
  username: 'sevilayha',
  password: 'password'
});

// call the built-in save method to save to the database
chris.save(function (err) {
  if (err) throw err;

  console.log('User saved successfully!');
});

app.listen(3000);