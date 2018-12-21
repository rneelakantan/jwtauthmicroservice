'use strict';

const jwtAuth = require('./jwt_auth');
var mongoose = require('mongoose'),
    fs = require('fs'),
    user = require('../../model/user'),
    UserModel = mongoose.model('User', 'UserSchema');


module.exports = async function(req, res) {
  return await signIn(req, res);
};

var signIn = async function(req, res) {
  return new Promise((resolve, reject) => {
    let body ='';
    let jsonBody;
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
      body += chunk.toString();
    });
    req.on('end', function() {
      jsonBody = JSON.parse(body);
      authUser(jsonBody).then((result) => {
    	  if (result instanceof Error) return reject(result);
	      resolve(result);   	  
      });
    });
    req.on('error', function(error) {
      reject(error);
    });
  });
};

var authUser = async function(userObj) {
  let user = await UserModel.load(userObj.username);
  if (user && user.authenticate(userObj.password)) {
  let result = await jwtAuth.sign({email: user.email, 
		  				username: user.username}, 
		  			{issuer: 'EmerHelp.com', 
		  				subject: 'EmerHelpUserAuthenticate', 
		  				audience: 'Client' });
  return result;
  } else {
	  return (new Error("Failed to authenticate"));
  }
}
