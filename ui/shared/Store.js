var { extend } = require('lodash');

class Store {
  constructor() {
    this.__reset__();

    return this;
  }

  addChangeListener(callback) {
    this._callbacks.push(callback);
  }

  removeChangeListener(callback) {
    var index = this._callbacks.indexOf(callback);

    if (index > -1) {
      this._callbacks.splice(index, 1);
    }
  }

  getInitialState() {
    return {};
  }

  setState(newState, done) {
    extend(this.state, newState);
    this.emitChange();

    if (done instanceof Function) {
      done();
    }
  }

  emitChange() {
    this._callbacks.forEach(function(callback) {
      callback();
    });
  }

  /**
   * @private
   *
   * A hook for tests to reset the Store to its initial state. Override this
   * to restore any side-effects.
   *
   * Usually during the life-time of the app, we will never have to reset a
   * Store, but in tests we do.
   */
  __reset__() {
    this._callbacks = [];
    this.clearState();
  }

  clearState() {
    this.state = this.getInitialState();
  }
}

module.exports = Store;