var DEFAULT_FORCE_EXIT_TIMEOUT = 2500;

module.exports = function(exit, customForceExitIn) {
  var didCleanUp = false;

  process.on('cleanup', function() {
    var forceExitIn = customForceExitIn || DEFAULT_FORCE_EXIT_TIMEOUT;

    didCleanUp = true;

    setTimeout(function forceExit() {
      console.warn(
        'Timed out trying to stop cleanly after ' + forceExitIn +
        'ms. Forcing exit.'
      );

      process.exit(1);
    }, forceExitIn);

    exit(function() {
      process.exit(0);
    });
  });

  process.on('exit', function () {
    if (!didCleanUp) {
      process.emit('cleanup');
    }
  });

  process.on('SIGINT', function () {
    console.log('SIGINT caught, terminating gracefully...');
    process.emit('cleanup');
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', function(e) {
    console.error('Uncaught Exception:', e.message);

    if (e.stack) {
      console.error(e.stack);
    }

    process.exit(99);
  });
};