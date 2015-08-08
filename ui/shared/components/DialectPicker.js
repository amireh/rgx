var React = require("react");
var { arrayOf, string } = React.PropTypes;
var classSet = require('utils/classSet');

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
        <a href={`#/dialects/${dialect}`}>{dialect}</a>
      </div>
    );
  }
});

module.exports = DialectPicker;