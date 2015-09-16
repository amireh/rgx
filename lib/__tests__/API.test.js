var Subject = require("../API");
var match = require('../TestHelpers').match;

describe("Server::API", function() {
  this.timeout(1000);

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
      expect(function() {
        Subject.start([ 'PCRE' ], done);
      }).not.to.throw();
    });
  });
});