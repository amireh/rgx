var TEST_PATTERN = 'foo(.*)';
var TEST_SUBJECTS = [ 'foobar' ];

function createStatusEntry() {
  return {
    online: false,
    lastOnlineAt: null,
    lastOfflineAt: null,
  };
}

function HeartbeatMonitor(dialects, API) {
  var exports = {};
  var statusMap = dialects.reduce(function(map, dialect) {
    map[dialect] = createStatusEntry();
    return map;
  }, { _meta: { lastCheckAt: null } });

  /**
   * @return {Object} statusMap
   *         A map of the status of every dialect channel.
   *
   * Here is an example map:
   *
   *     {
   *       "PCRE": {
   *         "online": true,
   *         "lastOnlineAt": "2015-09-29T12:21:40.710Z",
   *         "lastOfflineAt": null
   *       },
   *
   *       "_meta": {
   *         "lastCheckAt": "2015-09-29T12:21:40.710Z"
   *       }
   *     }
   */
  exports.getStatusMap = function() {
    return statusMap;
  };

  /**
   * Go through the available dialects and verify their channels are open
   * and actually operational. We'll do this by performing a simple construct
   * match against every open channel.
   *
   * The status is tracked in the [@statusMap]().
   *
   * @param  {Function} done
   *         Callback to invoke when all the available channels have been
   *         tested.
   */
  exports.check = function(done) {
    function testChannel(cursor) {
      var dialect = dialects[cursor];

      if (!dialect) {
        statusMap._meta.lastCheckAt = new Date();
        done();
      }
      else if (!API.isChannelOpen(dialect)) {
        statusMap[dialect].online = false;
        statusMap[dialect].lastOfflineAt = new Date();

        testChannel(cursor + 1);
      }
      else {
        API.match(dialect, TEST_PATTERN, TEST_SUBJECTS, null, function(results) {
          statusMap[dialect].online = (
            results.length === 1 &&
            results[0].status === 'RC_MATCH'
          );

          statusMap[dialect].lastOnlineAt = new Date();

          testChannel(cursor + 1);
        });
      }
    }

    testChannel(0);
  };

  /**
   * Convenience method for performing the heartbeat check periodically.
   *
   * @param {Number} frequency
   *        How often (in ms) should we perform the check.
   */
  exports.checkPeriodically = function(frequency) {
    setInterval(function() {
      exports.check(Function.prototype /* noop */);
    }, frequency || 60000);
  };

  return exports;
}

module.exports = HeartbeatMonitor;
