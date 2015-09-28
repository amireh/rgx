var compression = require('compression');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var config = require('../config');
var API = require('./API');
var cleanup = require('./utils/process.cleanup');

var host = config.HOST;
var port = config.PORT;
var app = require('express')();

// gzip/deflate outgoing responses
app.use(compression());

// parse urlencoded request bodies into req.body
app.use(bodyParser.json());

// Webpack devserver:
if (process.env.NODE_ENV === 'development') {
  require('./startDevServer')(app);
}

app.use(serveStatic('www', { etag: false }));

// Capabilities:
if (config.CAPABILITIES.elasticsearch) {
  require('./ESClient').start(config.CAPABILITIES.elasticsearch);
}

// Routes:
require('./API/dialects')(app);
require('./API/registry')(app);

// Internal error handler:
app.use(function onerror(err, req, res, next) {
  res.status(500).json({ message: err.message });
});

API.start(config.AVAILABLE_DIALECTS, function() {
  app.listen(port, host, function(err) {
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