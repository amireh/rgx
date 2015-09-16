var subject = require('../getAvailableDialects');

describe('#getAvailableDialects', function() {
  it('should work', function() {
    assert.include(subject(), 'PCRE');
  });
});