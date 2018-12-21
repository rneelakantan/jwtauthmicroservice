'use strict';
var mongoose = require('mongoose'),
    user = require('../model/user'),
    UserModel = mongoose.model('User', 'UserSchema');
    
    
module.exports = async function(req, res) {
  return await registerUser(req, res);
};

var registerUser = function(req, res) {
  return new Promise((resolve, reject) => {
    let body ='';
    let jsonBody;
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
      body += chunk.toString();
    });
    req.on('end', function() {
      jsonBody = JSON.parse(body);
      UserModel.create(jsonBody, jsonBody.password, function(err, result) {
        if (err) return reject(err)
        return resolve(result);  
      })
    });
    req.on('error', function(error) {
      reject(error);
    });
  });
};