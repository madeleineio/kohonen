/**
 * Created by nmondon on 09/02/2015.
 */
'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    http = require('http'),
    path = require('path'),
    routes = require('./routes'),
    app = module.exports = express();

/**
 * configuration
 */
// set port
app.set('port', 3012);
app.set('views', path.resolve('views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
// set assets dir
app.use(express.static(path.resolve('public')));

/**
 * routes
 */
app.get('*', routes.index);

/**
 * start server
 */
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});