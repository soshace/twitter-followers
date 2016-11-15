var express = require('express'),
  User = require('./models/User'),
  app = express(),
  _ = require('underscore'),
  mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/twitter-followers');

app.get('/unfollow/:useId', function (request, response) {
  var userId = request.params.useId;

  User.find({id: userId}).exec(function (error, user) {
    if (error) {
      return response.send({
        status: 'error',
        error: error
      });
    }

    if (_.isEmpty(user)) {
      return response.send({
        status: 'empty',
        user: null
      });
    }

    if (user) {
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
  var userId = request.params.useId;

  User.find({id: userId}).exec(function (error, user) {
    if (error) {
      return response.send({
        status: 'error',
        error: error
      });
    }

    if (user) {
      return response.send({
        status: 'followed'
      });
    }


    user.save(function (error, updatedUser) {
      if (error) {
        return response.send({
          status: 'error',
          error: error
        });
      }

      response.send({
        error: false,
        user: updatedUser
      });
    });
  });
});


app.listen(3000);