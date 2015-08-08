var ESClient = require('../startESClient');
var pick = require('lodash').pick;
var AVAILABLE_DIALECTS = require('../../config').AVAILABLE_DIALECTS;

module.exports = function(app) {
  app.get('/registry/:permalink', function(req, res) {
    var docId = new Buffer(req.params.permalink, 'base64').toString('ascii');

    ESClient.get(docId, function(doc) {
      res.status(200).json(doc);
    }, function(err) {
      res.status(400).json({ message: err });
    });
  });

  app.get('/registry', function(req, res) {
    ESClient.getPublicConstructs({ page: req.params.page || 0 }, function(docs) {
      res.status(200).json(docs);
    }, function(err) {
      res.status(400).json({ message: err });
    });
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
      ESClient.add(params, function(href) {
        res.status(200).json({ href: href });
      }, function(err) {
        res.status(400).json({ message: err });
      });
    }
  });

  app.patch('/registry/:id/upvote', function(req, res) {
    console.log(req);

    ESClient.vote(req.ip, req.params.id, 1, function(doc) {
      res.status(200).json(doc);
    }, function(err) {
      res.status(400).json({ message: err });
    });
  });

  app.patch('/registry/:id/downvote', function(req, res) {
    ESClient.vote(req.ip, req.params.id, -1, function(doc) {
      res.status(200).json(doc);
    }, function(err) {
      res.status(400).json({ message: err });
    });
  });
};