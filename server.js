#!/usr/bin/env node

var compression = require('compression');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var config = require('./config');
var path = require('path');
var API = require('./lib/API');
var cleanup = require('./lib/utils/process.cleanup');
var AVAILABLE_DIALECTS = config.AVAILABLE_DIALECTS;

var ROOT = __dirname;
var host = config.HOST;
var port = config.PORT;
var app = require('express')();

// gzip/deflate outgoing responses
app.use(compression());

// parse urlencoded request bodies into req.body
app.use(bodyParser.json());

app.use(serveStatic('www', { etag: false }));

// Webpack devserver:
if (process.env.NODE_ENV === 'development') {
  require('./lib/startDevServer')(app);
}

// Capabilities:
if (config.CAPABILITIES.elasticsearch) {
  require('./lib/startESClient').start(config.CAPABILITIES.elasticsearch);
}

// Routes:
require('./lib/API/dialects')(app);
require('./lib/API/permalink')(app);

// Internal error handler:
app.use(function onerror(err, req, res, next) {
  res.status(500).json({ message: err.message });
});

API.start(config.AVAILABLE_DIALECTS, function() {
  app.listen(port, host, function(err, result) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    else {
      console.info('[:rgx:] server up & running on ' + host + ':' + port);
    }
  });
});

cleanup(API.stop);