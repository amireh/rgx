var API = require('./API');

exports.match = function(dialect, pattern, subjects, flags, callback, done) {
	API.match(dialect, pattern, subjects, flags, function(result) {
		try {
			callback(result);
			done();
		}
		catch(e) {
			done(e);
		}
	});
};