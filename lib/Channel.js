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

    open: function(done) {
      client = spawn(binPath, [], {
        stdio: [ 'pipe', 'pipe', process.stderr ],
        detached: true,
      });

      if (!client.pid) {
        client = null;
        done('unable to start process');
        return;
      }

      client.on('error', function(err) {
        console.warn('Engine threw an error:', err);
        client = null;
      });

      client.stdout.on('data', function(chunk) {
        var buffer = String(chunk);

        if (buffer === CONFIG.SIGNAL_READY) {
          done();
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
      client.stdin.write(message + '\n');
    }
  };
};

module.exports = Channel;
