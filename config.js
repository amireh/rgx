exports.HOST = '0.0.0.0';
exports.PORT = 8952;
exports.WEBPACK_DEVSERVER_HOST = '0.0.0.0';
exports.WEBPACK_DEVSERVER_PORT = 8953;
exports.DIALECTS_DIR = 'dialects';
exports.SIGNAL_READY = 'ready';

exports.DIALECT_BINMAP = {
  'PCRE': 'rgx-PCRE.lua',
  'Ruby': 'rgx-Ruby.rb',
  'Perl': 'rgx-Perl.pm',
};

exports.CAPABILITIES = {
  'elasticsearch': {
    host: 'localhost',
    port: '9200'
  }
};

exports.AVAILABLE_DIALECTS = [
  // 'C++',
  // 'Java',
  // 'JavaScript',
  // 'Lua',
  'PCRE',
  // 'PHP',
  'Perl',
  // 'Python',
  'Ruby'
];