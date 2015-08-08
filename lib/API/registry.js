var ESClient = require('../startESClient');
var pick = require('lodash').pick;
var AVAILABLE_DIALECTS = require('../../config').AVAILABLE_DIALECTS;

function onSuccess(res, doc) {
  res.status(200).json(doc);
}

function onError(res, errorMessage) {
  res.status(400).json({ message: errorMessage });
}

module.exports = function(app) {
  app.get('/registry/:permalink', function(req, res) {
    var docId = new Buffer(req.params.permalink, 'base64').toString('ascii');

    ESClient.get(
      docId,
      onSuccess.bind(null, res),
      onError.bind(null, res)
    );
  });

  app.get('/registry', function(req, res) {
    ESClient.getPublicConstructs(
      { page: req.params.page || 0 },
      onSuccess.bind(null, res),
      onError.bind(null, res)
    );
  });

  app.post('/registry', function(req, res) {
    var params = pick(req.body, [
      'dialect',
      'description',
      'author',
      'pattern',
      'subjects',
      'flags'
    ]);

    params.public = !!req.body.public;
    params.stars = [];

    if (!params.dialect) {
      res.status(400).json({ message: 'missing dialect' });
    }
    else if (AVAILABLE_DIALECTS.indexOf(params.dialect) === -1) {
      res.status(400).json({ message: 'unknown dialect "' + params.dialect + '"'})
    }
    else if (!params.pattern) {
      res.status(400).json({ message: 'missing pattern' });
    }
    else if (!params.subjects || !params.subjects.length) {
      res.status(400).json({ message: 'you must at least specify 1 subject' });
    }
    else {
      ESClient.add(
        params,
        onSuccess.bind(null, res),
        onError.bind(null, res)
      );
    }
  });

  app.patch('/registry/:id/upvote', function(req, res) {
    ESClient.vote(
      req.ip,
      req.params.id,
      1,
      onSuccess.bind(null, res),
      onError.bind(null, res)
    );
  });

  app.patch('/registry/:id/downvote', function(req, res) {
    ESClient.vote(
      req.ip,
      req.params.id,
      -1,
      onSuccess.bind(null, res),
      onError.bind(null, res)
    );
  });
};