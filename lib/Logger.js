var VERBOSE = !!process.env.VERBOSE;
var NO_MUTE_LEVELS = [ 'warn', 'error' ];

module.exports = function(context) {
  var logger = {};
  var loggingContext = context + ':';

  [ 'info', 'warn', 'error', 'log' ].forEach(function(logLevel) {
    logger[logLevel] = function() {
      if (!VERBOSE && NO_MUTE_LEVELS.indexOf(logLevel) === -1) {
        return;
      }

      var args = [].slice.call(arguments);
      args[0] = loggingContext + ' ' + args[0];
      console[logLevel].apply(console, args);
    };
  });

  return logger;
};
