const Store = require('Store');
const ajax = require('utils/ajax');

class Heartbeat extends Store {
  getInitialState() {
    return {
      statusMap: {}
    };
  }

  check() {
    ajax({
      url: '/api/heartbeat'
    }, (statusMap) => {
      this.setState({ statusMap });
    });
  }

  isChannelOpen(dialect) {
    if (!this.state.statusMap[dialect]) {
      return null;
    }
    else {
      return this.state.statusMap[dialect].online;
    }
  }
}

module.exports = new Heartbeat();