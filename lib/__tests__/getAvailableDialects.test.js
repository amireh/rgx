var subject = require('../getAvailableDialects');
var assert = require('chai').assert;

describe('#getAvailableDialects', function() {
  it('should work', function() {
    assert.include(subject(), 'PCRE');
  });
});