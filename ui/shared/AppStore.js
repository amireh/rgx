var Store = require('Store');
var { AVAILABLE_DIALECTS } = require('getConfig')();

var flagFiles = require.context("json!dialects/", true, /([^\/]+)\/flags.json$/);

var FLAGS = flagFiles.keys().reduce(function(flags, flagFile) {
  var dialectFlags = flagFiles(flagFile);
  var dialect = flagFile.split('/')[1];

  flags[dialect] = Object.keys(dialectFlags).map(function(flagName) {
    return { name: flagName, desc: dialectFlags[flagName] };
  });

  return flags;
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