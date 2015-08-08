const Store = require('Store');
const ajax = require('utils/ajax');
const { findWhere, sortByAll } = require('lodash');

class ConstructStore extends Store {
  getInitialState() {
    return {
      constructs: []
    };
  }

  fetch() {
    ajax({
      url: '/registry',
      data: JSON.stringify({ page: 0 }),
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    }, (payload) => {
      this.setState({
        constructs: sortByAll(payload, ['stars', 'id']).reverse()
      });
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