'use strict';

// const createError = require('http-errors');
const User = require('../models/user');

module.exports = exports ={};

exports.createItem = function(req){

  let tempPassword = null;
  tempPassword = req.body.password;
  req.body.password = null;
  delete req.body.password;

  let newUser = new User(req.body);

  return newUser.generatePasswordHash(tempPassword)
  .then(user => user.save())
  .then(user => {
    return user.generateToken();
  });
};

exports.fetchItem = function(req, res){

  return User.findOne({username: req.auth.username})
  .then(user => user.comparePasswordHash(req.auth.password))
  .then(user => user.generateToken())
  .then(token => token)
  .catch(err => res.status(err.status).send(404, err.message));

};
