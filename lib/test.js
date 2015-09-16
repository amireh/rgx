var glob = require('glob');
var path = require('path');
var assert = require('chai').assert;
var expect = require('chai').expect;
var API = require("./API");

global.assert = assert;
global.expect = expect;
global.TestUtils = {};

TestUtils.createMatcher = function(dialect) {
  return function match(pattern, subjects, flags, done) {
    API.start([ dialect ], function() {
      API.match(dialect, pattern, subjects, flags, done);
    });
  }
};