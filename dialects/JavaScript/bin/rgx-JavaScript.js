#!/usr/bin/env node

var RC_MATCH = 'RC_MATCH';
var RC_NOMATCH = 'RC_NOMATCH';
var RC_BADPATTERN = 'RC_BADPATTERN';

var buffer = '';

function run(construct) {
  var pattern = construct.pattern;
  var subject = construct.subject || '';
  var flags = construct.flags;
  var compiled, match;

  try {
    compiled = RegExp(pattern, flags);
  }
  catch (e) {
    return {
      status: RC_BADPATTERN,
      message: e.message
    };
  }

  match = compiled.exec(subject);
  var captures = [];

  if (match) {
    return {
      status: RC_MATCH,
      offset: [ match.index, match.index + match[0].length ],
      captures: match.filter(function(capture, index) {
        return index !== 0;
      }).map(function(str) {
        if (!str) {
          return null;
        }
        else {
          return [ match[0].indexOf(str), match[0].indexOf(str) + str.length ];
        }
      }).filter(function(captureOffset) {
        return captureOffset !== null;
      })
    };
  }
  else {
    return {
      status: RC_NOMATCH
    };
  }
}

process.stdin.on('data', function(chunk) {
  var response;

  buffer += chunk.toString();

  buffer.split("\n").forEach(function(line) {
    var construct, response;

    if (line.trim().length === 0) {
      buffer = '';
      return;
    }

    try {
      construct = JSON.parse(line);
      response = run(construct);
      buffer = '';

      process.stdout.write(JSON.stringify(response) + '\n');
    }
    catch(e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
      else {
        console.warn('JSON parse error:', e.message);
        console.warn('"' + buffer + '"')
      }
    }

  });
});

console.log('ready');
