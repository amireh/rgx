exports.HOST = process.env.HOST || '0.0.0.0';
exports.PORT = process.env.PORT || 8952;
exports.WEBPACK_DEVSERVER_HOST = process.env.HOST || '0.0.0.0';
exports.WEBPACK_DEVSERVER_PORT = process.env.WEBPACK_PORT || 8953;
exports.DIALECTS_DIR = 'dialects';
exports.SIGNAL_READY = 'ready\n';

exports.DIALECT_BINMAP = {
  'PCRE': 'rgx-PCRE.lua',
  'Ruby': 'rgx-Ruby.rb',
  'Perl': 'rgx-Perl.pm',
  'JavaScript': 'rgx-JavaScript.js',
};

exports.CAPABILITIES = {
  'elasticsearch': {
    host: process.env.ELASTIC_SEARCH_HOST || 'localhost',
    port: process.env.ELASTIC_SEARCH_PORT || '9200'
  }
};

exports.AVAILABLE_DIALECTS = [
  // 'C++',
  // 'Java',
  'JavaScript',
  // 'Lua',
  'PCRE',
  // 'PHP',
  'Perl',
  // 'Python',
  'Ruby'
];