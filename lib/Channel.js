var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var Logger = require('./Logger');
var CONFIG = require('../config');
var ROOT = path.resolve(__dirname, '..');
var assert = require('assert');

function getDialectBinPath(dialect) {
  var binMap = CONFIG.DIALECT_BINMAP;
  var binName = binMap[dialect] || 'rgx-' + dialect;

  return path.resolve(ROOT, 'dialects', dialect, 'bin', binName);
}

function once(f) {
  var called = false

  return function() {
    if (called) {
      return
    }

    called = true

    f.apply(null, arguments)
  }
}

var Channel = function(dialect) {
  var client;
  var binPath = getDialectBinPath(dialect);
  var console = new Logger('Channel[' + dialect + ']');
  var queue = [];

  assert(fs.existsSync(binPath),
    'Expected binary for dialect "' + dialect + '" to exist at "' + binPath + '"'
  );

  return {
    id: dialect,

    toString: function() {
      return 'Channel[' + dialect + ']';
    },

    open: function(_callback) {
      var callback = once(_callback)

      client = spawn(binPath, [], {
        stdio: [ 'pipe', 'pipe', process.stderr ],
        detached: true,
      });

      if (!client.pid) {
        client = null;
        callback('engine could not be started');
        return;
      }

      client.on('error', function(err) {
        console.error('engine raised an error:');
        console.error(err)

        client = null;
      });

      client.on('exit', function(code) {
        if (code !== 0) {
          console.log('propagating engine failure')
          callback('engine exited unexpectedly')
        }

        client = null;
      });

      client.stdout.on('data', function(chunk) {
        var buffer = String(chunk);

        if (buffer === CONFIG.SIGNAL_READY) {
          setTimeout(function() {
            callback()
          }, 100);
        }
        else {
          buffer
            .split("\n")
            .filter(function(result) {
              return result.length > 0;
            })
            .forEach(function(result) {
              if (queue.length > 0) {
                queue.shift()(JSON.parse(result));
              }
            })
          ;
        }
      });
    },

    isOpen: function() {
      return !!client;
    },

    close: function(done) {
      queue = [];

      client.on('exit', function(code) {
        client = null;
        done(code);
      });

      client.stdin.end();
    },

    /**
     * Send a message to the dialect engine.
     *
     * @async
     *
     * @param {String} message
     * @param {Function} done
     *        Callback to invoke when a response was received from the engine.
     *
     * @param {Object} done.response
     *        The response object.
     */
    send: function(message, done) {
      queue.push(done);

      try {
        client.stdin.write(message + '\n');
      }
      catch (e) {
        if (e.message !== 'This socket has been ended by the other party') {
          throw e;
        }
      }
    }
  };
};

module.exports = Channel;
