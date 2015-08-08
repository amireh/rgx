var Store = require('Store');
var { AVAILABLE_DIALECTS } = require('getConfig')();

var flagFiles = require.context("json!dialects/", true, /([^\/]+)\/flags.json$/);
var cheatSheetFiles = require.context("html!dialects/", true, /([^\/]+)\/cheatsheet.html$/);

var FLAGS = flagFiles.keys().reduce(function(flags, flagFile) {
  var dialectFlags = flagFiles(flagFile);
  var dialect = flagFile.split('/')[1];

  flags[dialect] = Object.keys(dialectFlags).map(function(flagName) {
    return { name: flagName, desc: dialectFlags[flagName] };
  });

  return flags;
}, {});

var CHEAT_SHEETS = cheatSheetFiles.keys().reduce(function(cheatSheets, file) {
  var content = cheatSheetFiles(file);
  var dialect = file.split('/')[1];

  cheatSheets[dialect] = content;

  return cheatSheets;
}, {});

class AppStore extends Store {
  getInitialState() {
    return {
      error: null,
      internalError: null
    };
  }

  getAvailableDialects() {
    return AVAILABLE_DIALECTS;
  }

  getAvailableFlags(dialect) {
    return FLAGS[dialect];
  }

  getCheatSheet(dialect) {
    return CHEAT_SHEETS[dialect];
  }

  getLatestError() {
    return this.state.error;
  }

  getLatestInternalError() {
    return this.state.internalError;
  }

  setError(error, statusCode) {
    switch (statusCode) {
      case 400:
      case 422:
        this.setState({ error: error.message });
      break;

      default:
        this.setState({ internalError: error.message });
    }
  }

  clearError() {
    this.setState({ error: undefined });
  }

  clearInternalError() {
    this.setState({ internalError: undefined });
  }
}

module.exports = new AppStore();