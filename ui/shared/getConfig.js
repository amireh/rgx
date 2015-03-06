var { extend } = require("lodash");
var defaults = require("../../config");
var cache;

module.exports = function() {
  return cache || (function() {
    var config = cache = extend({}, defaults);

    // if (process.env.NODE_ENV === 'development') {
    //   require('../views/Editor/shared/Actions').submit();
    // }

    return config;
  }());
};