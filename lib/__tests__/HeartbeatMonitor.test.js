var Subject = require("../HeartbeatMonitor");
var API = require('../API');
var assert = require('chai').assert;

describe("Server::HeartbeatMonitor", function() {
  describe('#check', function() {
    afterEach(function(done) {
      API.stop(done);
    });

    it('should check all available dialects', function(done) {
      var subject = Subject([ 'PCRE', 'Ruby' ], API);

      API.start([ 'PCRE', 'Ruby' ], function() {
        subject.check(function() {
          var statusMap = subject.getStatusMap();

          assert.equal(statusMap.PCRE.online, true);

          done();
        });
      });
    });

    it('should report a broken channel', function(done) {
      var subject = Subject([ 'PCRE' ], API);

      API.start([], function() {
        subject.check(function() {
          var statusMap = subject.getStatusMap();

          assert.equal(statusMap.PCRE.online, false);

          done();
        });
      });
    });
  });
});