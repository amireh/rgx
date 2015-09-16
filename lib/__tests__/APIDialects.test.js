var API = require("../API");
var AVAILABLE_DIALECTS = require('../../config').AVAILABLE_DIALECTS;

AVAILABLE_DIALECTS.forEach(function(dialect) {
  function matchAndAssert(pattern, subjects, flags, assertions, done) {
    API.match(dialect, pattern, subjects, flags, function(results) {
      try {
        assertions(results);
        done();
      }
      catch(e) {
        done(e);
      }
    });
  }

  describe("API::Dialects::" + dialect, function() {
    before(function(done) {
      API.start([ dialect ], done);
    });

    after(function(done) {
      if (API.isRunning()) {
        API.stop(done);
      }
      else {
        done();
      }
    });

    it('should mark itself ready', function() {
      assert.ok(API.isChannelOpen(dialect));
    });

    it('should report a match', function(done) {
      matchAndAssert('foo', [ 'foobar' ], [], function(results) {
        assert.deepEqual(results[0], {
          "status": "RC_MATCH",
          "captures": [],
          "offset": [0,3]
        });
      }, done);
    });

    it('should report a capture', function(done) {
      matchAndAssert('foo(.*)', [ 'foobar' ], [], function(results) {
        assert.deepEqual(results[0], {
          "status": "RC_MATCH",
          "captures": [ [3,6] ],
          "offset": [0,6]
        });
      }, done);
    });

    it('should work with non-capturing groups (?:)', function(done) {
      matchAndAssert("(?:t|foo(bar))", ["foobarzoo","t"], [], function(results) {
        assert.equal(results[0].status, 'RC_MATCH');
        assert.deepEqual(results[0].captures, [[3,6]]);
        assert.equal(results[1].status, 'RC_MATCH');
        assert.deepEqual(results[1].captures, []);
      }, done);
    });

    it('should report a no-match', function(done) {
      matchAndAssert('foo(.*)', [ 'asdf' ], [], function(results) {
        assert.deepEqual(results[0], {
          "status": "RC_NOMATCH"
        });
      }, done);
    });

    it('should report a bad pattern', function(done) {
      matchAndAssert('f)oo', [ 'asdf' ], [], function(results) {
        assert.equal(results[0].status, "RC_BADPATTERN");
        assert.ok(results[0].hasOwnProperty('message'));
      }, done);
    });

    it('should work with multiple subjects', function(done) {
      matchAndAssert('foo(.*)', [ 'foobar', 'fooZOO', 'xyz' ], [], function(results) {
        assert.equal(results.length, 3);
        assert.equal(results[0].status, 'RC_MATCH');
        assert.equal(results[1].status, 'RC_MATCH');
        assert.equal(results[2].status, 'RC_NOMATCH');
      }, done);
    });

    describe('edge-cases', function() {
      it('should work with a pattern (or subject) that contains \\n', function(done) {
        matchAndAssert('foo\\nbar', [ 'foo\nbar', 'foo\\nbar' ], [], function(result) {
          assert.equal(result[0].status, 'RC_MATCH');
          assert.deepEqual(result[0].offset, [0,7]);
          assert.equal(result[1].status, 'RC_NOMATCH');
        }, done);
      });
    });
  });
});