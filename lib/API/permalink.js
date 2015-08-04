var ESClient = require('../startESClient');
var pick = require('lodash').pick;
var AVAILABLE_DIALECTS = require('../../config').AVAILABLE_DIALECTS;

module.exports = function(app) {
  app.get('/permalinks/:permalink', function(req, res) {
    var docId = new Buffer(req.params.permalink, 'base64').toString('ascii');

    ESClient.getPermalink(docId, function(doc) {
      res.status(200).json(doc);
    }, function(err) {
      res.status(400).json({ message: err });
    });
  });

  app.post('/dialects/:dialect/permalink', function(req, res) {
    var params = pick(req.body, [ 'pattern', 'subjects', 'flags' ]);

    params.dialect = req.params.dialect;

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
      ESClient.generatePermalink(params, function(href) {
        res.status(200).json({ href: href });
      }, function(err) {
        res.status(400).json({ message: err });
      });
    }
  });
};