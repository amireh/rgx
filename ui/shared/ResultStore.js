var Store = require('Store');

class ResultStore extends Store {
  getInitialState() {
    return {
      permalink: null,
      results: []
    };
  }

  getAll() {
    return this.state.results;
  }

  getPermalink() {
    return this.state.permalink;
  }
}

module.exports = new ResultStore();