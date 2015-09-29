var rgxConfig = require('../../config');
var AVAILABLE_DIALECTS = rgxConfig.AVAILABLE_DIALECTS;
var API = require('../API');

module.exports = function(app) {
  app.post('/api/dialects/:dialect', function(req, res) {
    var params = req.body;
    var dialect = req.params.dialect;

    if (AVAILABLE_DIALECTS.indexOf(dialect) === -1) {
      res.status(400).json({
        message: "unknown dialect '" + dialect + "'"
      });

      return;
    }

    API.match(dialect, params.pattern, params.subjects, params.flags, function(result) {
      res.status(200).json(result);
    });
  });
};