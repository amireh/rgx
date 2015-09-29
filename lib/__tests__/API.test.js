var Subject = require("../API");
var assert = require('chai').assert;

describe("Server::API", function() {
  afterEach(function(done) {
    Subject.stop(done);
  });

  describe('@start', function() {
    it('should create delegates and connect', function(done) {
      assert.doesNotThrow(function() {
        Subject.start([ 'PCRE' ], done);
      });
    });
  });
});