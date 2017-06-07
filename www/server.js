 /*
 *  @Author: Matthew Ormsby
 */

var express = require('express');
var configs = express();
var router = express.Router();
var bodyParser = require('body-parser');

var fs = require('fs');
var readline = require('readline');

var startServer = function() {
  var server = configs.listen(configs.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('Access the app at http://%s:%s', host, port);
  });
};

// config for cross domain calls
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

configs.set('port', process.env.PORT || 5000);

// set up configs for the express server
configs.use(allowCrossDomain);
configs.use(express.static(__dirname + '/../www/src')); // serve up all the files in /../www

configs.use(bodyParser.json({limit: '50mb'}));
configs.use(bodyParser.urlencoded({limit: '50mb'}));

// parse application/x-www-form-urlencoded
configs.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
configs.use(bodyParser.json());
configs.use("/api",router);

configs.all('/*', function(req, res) { // ensure when accessing at this level you get back the index.html file only
  res.sendFile('index.html', { root: __dirname+'/../www/src' });
});

startServer();

