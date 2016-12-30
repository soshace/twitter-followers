var express = require('express'),
  User = require('./models/User'),
  app = express(),
  mongoose = require('mongoose');

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

mongoose.connect('mongodb://localhost/twitter-followers');

app.get('/unfollow/:twitterId', function (request, response) {
  var twitterId = request.params.twitterId;

  User.findOne({twitterId: twitterId}).exec(function (error, user) {
    if (error) {
      return response.send({
        status: 'error',
        error: error
      });
    }

    if (user === null) {
      return response.send({
        status: 'empty',
        user: null
      });
    }

    if (user) {
      if (user.unfollowed) {
        return response.send({
          status: 'already unfollowed',
          user: user
        });
      }

      user.unfollowed = new Date();

      user.save(function (error, updatedUser) {
        if (error) {
          return response.send({
            status: 'error',
            error: error
          });
        }

        response.send({
          status: 'success',
          user: updatedUser
        });
      });
    }
  });
});


app.get('/follow/:useId', function (request, response) {
  var twitterId = request.params.useId;

  User.findOne({twitterId: twitterId}).exec(function (error, user) {
    var newUser;

    if (error) {
      return response.send({
        status: 'error',
        error: error
      });
    }

    if (user) {
      return response.send({
        status: 'already followed',
        user: user
      });
    }

    newUser = new User({
      twitterId: twitterId,
      followed: new Date()
    });

    newUser.save(function (error, updatedUser) {
      if (error) {
        return response.send({
          status: 'error',
          error: error
        });
      }

      response.send({
        status: 'success',
        user: updatedUser
      });
    });
  });
});


app.listen(3000);