var elasticsearch = require('elasticsearch');
var client;

exports.start = function(config) {
  client = new elasticsearch.Client({
    host: {
      host: config.host,
      port: config.port
    },

    log: process.env.VERBOSE ? 'trace' : undefined
  });
};

exports.stop = function(done) {
  client = null;
  done();
};

exports.generatePermalink = function(params, onSuccess, onError) {
  client.create({
    index: 'rgx',
    type: 'construct',
    body: params
  }, function (error, response) {
    if (error) {
      return onError(error.message);
    }
    else {
      onSuccess(new Buffer(response._id).toString('base64'));
    }
  });
};

exports.getPermalink = function(id, onSuccess, onError) {
  client.get({
    id: id,
    index: 'rgx',
    type: 'construct'
  }, function(error, response) {
    if (error) {
      return onError(error.message);
    }
    else {
      onSuccess(response._source);
    }
  });
};