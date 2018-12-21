var url = require('url');
var auth = require('./controllers/auth/auth');
var register = require('./controllers/register');


module.exports = async function(req, res, next) {
  let pathName = url.parse(req.url).pathname;
  let method = req.method;
  let response;
  const contentLength = req.headers['content-length'];
  switch(pathName) {
  	case '/authenticate':
  		if (method === 'POST') {
  			if (contentLength > 200) {
  			  response = {status: 413, message: 'Request Entity Too Large'};
  			  return next(response);
  			};
  			let result = await auth(req, res);
  		    if(result instanceof Error) {
  		      response = {status: 404, message: result.message, token: null};
  		    } else {
  		      response = {status: 200, token: result};
  		    };
  			return next(response);
  		};
  	break;
	case '/register':
		if (method === 'POST') {
  			if (contentLength > 5000000) {
    			  response = {status: 413, message: 'Request Entity Too Large'};
    			  return next(response);
    			};
			let result = await register(req, res);
  		    if(result instanceof Error) {
    		  response = {status: 404, message: result.message, user: null};
    		} else {
    		   response = {status: 200, user: result};
    		};
			return next(response);
		};
	break;
	default:
		return next({status: 401, message: 'Unauthorized'});
	break;
  }
}