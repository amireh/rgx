var Subject = require("../API");

describe("Server::API", function() {
  afterEach(function(done) {
    if (Subject.isRunning()) {
      Subject.stop(done);
    }
    else {
      done();
    }
  });

  describe('@start', function() {
    it('should create delegates and connect', function(done) {
      assert.doesNotThrow(function() {
        Subject.start([ 'PCRE' ], done);
      });
    });
  });
});