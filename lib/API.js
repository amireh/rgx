var async = require('async');
var Channel = require('./Channel');
var Construct = require('./Construct');
var Logger = require('./Logger');
var findWhere = require('lodash').findWhere;

var channels = [];

exports.start = function(dialects, done) {
  var cursor = 0

  channels = dialects.map(Channel);
  async.series(channels.map(channel => {
    return function(callback) {
      cursor += 1

      console.log('Opening channel "%s"...', channel.id)

      channel.open(function(err) {
        if (!err) {
          console.log(
            'Channel "%s" is now open. (%d/%d)',
            channel.id,
            cursor,
            channels.length
          );
        }

        callback(err)
      })
    }
  }), done)
};

exports.stop = function(done) {
  function closeChannelAt(cursor) {
    var channel = channels[cursor];

    if (!channel) {
      channels = [];
      return done();
    }

    console.log('Closing ' + channel);

    if (!channel.isOpen()) {
      closeChannelAt(cursor + 1);
    }
    else {
      try {
        channel.close(function() {
          console.log(
            channel + ' has been closed. %d/%d',
            cursor + 1,
            channels.length
          );

          closeChannelAt(cursor + 1);
        });
      }
      catch (e) {
        console.warn('Unable to close channel cleanly:', e.message);

        if (e.stack) {
          console.info(e.stack);
        }

        closeChannelAt(cursor + 1);
      }
    }
  }

  closeChannelAt(0);
};

exports.match = function(dialect, pattern, subjects, flags, done) {
  var channel = findWhere(channels, { id: dialect });
  var results = [];

  if (!channel) {
    throw new Error('Channel "' + dialect + '" has not been opened.');
  }
  else if (!channel.isOpen()) {
    throw new Error('Channel "' + dialect + '" is unavailable');
  }

  if (!subjects || !subjects.length) {
    return done([]);
  }

  subjects.forEach(function(subject) {
    channel.send(Construct(pattern, subject, flags), function(result) {
      results.push(result);

      if (results.length === subjects.length) {
        done(results);
      }
    });
  });
};

exports.isChannelOpen = function(dialect) {
  var channel = findWhere(channels, { id: dialect });

  return channel && channel.isOpen();
};
