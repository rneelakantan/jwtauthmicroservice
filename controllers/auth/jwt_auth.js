const fs = require('fs');
const jwt = require('jsonwebtoken');

// use 'utf8' to get string instead of byte array  (256 bit key)
var privateKEY  = fs.readFileSync('./controllers/auth/rsa_private.key', 'utf8');
var publicKEY  = fs.readFileSync('./controllers/auth/rsa_public.key', 'utf8');  
module.exports = {
 sign: async (payload, $Options) => {
	 return new Promise((resolve, reject) => {
	  /*
	   $Options = {
	    issuer: "Authorizaxtion/Resource/This server",
	    subject: "iam@user.me", 
	    audience: "Client_Identity" // this should be provided by client
	   }
	  */
	  // Token signing options
	  var signOptions = {
	      issuer:  $Options.issuer,
	      subject:  $Options.subject,
	      audience:  $Options.audience,
	      expiresIn:  "30d",    // 30 days validity
	      algorithm:  "RS256"    
	  };
	  jwt.sign(payload, privateKEY, signOptions, function(err, token){
		if (err) return reject(err);
		return resolve(token);
	  });
  });
},
verify: (token, $Option) => {
  /*
   vOption = {
    issuer: "Authorization/Resource/This server",
    subject: "iam@user.me", 
    audience: "Client_Identity" // this should be provided by client
   }  
  */
  var verifyOptions = {
      issuer:  $Option.issuer,
      subject:  $Option.subject,
      audience:  $Option.audience,
      expiresIn:  "30d",
      algorithm:  ["RS256"]
  };
   try{
     return jwt.verify(token, publicKEY, verifyOptions);
   }catch (err){
     return false;
   }
},
 decode: (token) => {
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
 }
}