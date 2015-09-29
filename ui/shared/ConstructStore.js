const Store = require('Store');
const ajax = require('utils/ajax');
const { findWhere } = require('lodash');

class ConstructStore extends Store {
  getInitialState() {
    return {
      constructs: []
    };
  }

  fetch() {
    ajax({
      url: '/api/registry',
      data: JSON.stringify({ page: 0 }),
    }, (constructs) => {
      this.setState({ constructs });
    });
  }

  getAll() {
    return this.state.constructs;
  }

  update(id, data) {
    const item = findWhere(this.state.constructs, { id });

    if (item) {
      this.state.constructs.splice(this.state.constructs.indexOf(item), 1);
      this.state.constructs.push(data);

      this.emitChange();
    }
  }
}

module.exports = new ConstructStore();