'use strict';
var mongoose = require('mongoose');
var route = require('./route');
var config = require('./config/config')(process.env.NODE_ENV);

let httpProtocol, port;
port = config.dbPort;
if (process.env.NODE_ENV === "development") {
  httpProtocol = require('http');
} else {
  httpProtocol = require('https');
};

mongoose.connect(config.dbUrl, config.options, (err) => {
    if (err) {
    	console.log(err);
    	return;
    }
	var server = httpProtocol.createServer((req, res) => {
	  let response;
	  route(req, res, function(result) {
		response = result;
	    res = setResponseHeader(res, response);
	    res.write(JSON.stringify(response));
	    res.end();
	  });
	});
	
	
	let setResponseHeader = function(res, body) {
	  res.setHeader('Content-Length', JSON.stringify(body).length);
	  res.writeHead(200, {"Content-Type": "application/json"});
	  return res;
	}
	
	server.listen(port);

});
