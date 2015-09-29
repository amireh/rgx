const React = require("react");
const { bool, arrayOf, string } = React.PropTypes;
const classSet = require('utils/classSet');
const Heartbeat = require('Heartbeat');

const Status = React.createClass({
  propTypes: {
    isOnline: bool,
  },

  render() {
    if (this.props.isOnline === false) {
      return (
        <span
          title="This dialect is currently unavailable."
          className="dialect-picker__status dialect-picker__status--offline"
        />
      );
    }
    else {
      return null;
    }
  }
});

var DialectPicker = React.createClass({
  displayName: "DialectPicker",

  propTypes: {
    availableDialects: arrayOf(string)
  },

  getDefaultProps: function() {
    return {
      availableDialects: []
    };
  },

  render() {
    const className = classSet({
      'dialect-picker': true,
      'dialect-picker--list': this.props.listMode
    });

    return(
      <div className={className}>
        {this.props.availableDialects.map(this.renderDialect)}
      </div>
    );
  },

  renderDialect: function(dialect) {
    var className = classSet({
      'dialect-picker__dialect': true,
      'dialect-picker__dialect--active': this.props.activeDialect === dialect
    });

    return (
      <div key={dialect} onClick={this.props.onClick} className={className}>
        <a href={`#/dialects/${dialect}`}>
          {dialect}
          <Status isOnline={Heartbeat.isChannelOpen(dialect)} />
        </a>
      </div>
    );
  }
});

module.exports = DialectPicker;