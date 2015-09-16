var elasticsearch = require('elasticsearch');
var extend = require('lodash').extend;
var client;

function renderDocument(doc) {
  return extend({
    id: doc._id,
    href: new Buffer(doc._id).toString('base64')
  }, doc._source, {
    stars: (doc._source.stars || []).reduce(function(sum, star) {
      return sum += star.mod;
    }, 0)
  });
}

exports.start = function(config) {
  client = new elasticsearch.Client({
    host: {
      host: config.host,
      port: config.port
    },

    log: process.env.DEBUG ? 'trace' : undefined
  });
};

exports.stop = function(done) {
  client = null;
  done();
};

exports.add = function(params, onSuccess, onError) {
  client.create({
    index: 'rgx',
    type: 'construct',
    body: params
  }, function (error, response) {
    if (error) {
      onError(error.message);
    }
    else {
      exports.get(response._id, onSuccess, onError);
    }
  });
};

exports.get = function(id, onSuccess, onError) {
  client.get({
    id: id,
    index: 'rgx',
    type: 'construct'
  }, function(error, response) {
    if (error) {
      onError(error.message);
    }
    else {
      onSuccess(renderDocument(response));
    }
  });
};

exports.getPublicConstructs = function(query, onSuccess, onError) {
  var PER_PAGE = 1000;

  client.search({
    index: 'rgx',
    type: 'construct',
    size: PER_PAGE,
    from: query.page * PER_PAGE,
    q: 'public:true'
  }, function(error, response) {
    if (error) {
      onError(error.message);
    }
    else {
      onSuccess(response.hits.hits.map(renderDocument));
    }
  });
};

exports.vote = function(ip, id, mod, onSuccess, onError) {
  client.get({
    id: id,
    index: 'rgx',
    type: 'construct'
  }, function(error, response) {
    if (error) {
      onError(error.message);
    }
    else {
      var doc = response._source;

      // have they voted already ?
      if ((doc.stars || []).some(function(star) { return star.ip === ip; })) {
        return onError({ message: 'You have already voted for this construct.' });
      }

      client.update({
        index: 'rgx',
        type: 'construct',
        id: id,
        body: {
          doc: {
            stars: doc.stars.concat([ { mod: mod, ip: ip } ])
          }
        }
      }, function(error, _response) {
        if (error) {
          onError(error);
        }
        else {
          exports.get(id, onSuccess, onError);
        }
      });
    }
  });
};