var Channel = require('./Channel');
var Construct = require('./Construct');
var Logger = require('./Logger');
var findWhere = require('lodash').findWhere;
var channels = [];
var running = false;

var console = Logger('API');

exports.start = function(dialects, done) {
  var opened = 0;

  function openChannelForDialectAt(cursor) {
    var dialect = dialects[cursor];
    var channel;

    if (!dialect) {
      return done();
    }

    console.log('Opening channel "%s".', dialect);

    channel = Channel(dialect);
    channel.open(function trackChannelAndOpenNext(err) {
      if (err) {
        // TODO: would be nice if we could propagate the error or some signal
        console.error(channel + ' has failed to open, ignoring.');
        console.info(err);
      }
      else {
        ++opened;
        console.log('Channel "%s" is now open (%d/%d).', dialect, opened, dialects.length);
        channels.push(channel);
      }

      openChannelForDialectAt(cursor + 1);
    });
  }

  openChannelForDialectAt(0);

};

exports.stop = function(done) {
  var closed = 0;

  function closeChannelAt(cursor) {
    var channel = channels[cursor];

    if (!channel) {
      running = false;
      return done();
    }

    channel.close(function() {
      ++closed;
      console.log(channel + ' has been closed. %d/%d', closed, channels.length);
      closeChannelAt(cursor + 1);
    });
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

exports.isRunning = function() {
  return running;
};

exports.isChannelOpen = function(dialect) {
  var channel = findWhere(channels, { id: dialect });

  return channel && channel.isOpen();
};