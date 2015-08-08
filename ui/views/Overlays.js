var React = require('react');
var Cheatsheet = require("components/Cheatsheet");

var Overlays = React.createClass({
  getDefaultProps() {
    return {
      query: {},
      params: {}
    };
  },

  render: function() {
    return (
      <div>
        {this.props.query.cheatsheet &&
          <Cheatsheet dialect={this.props.query.cheatsheet} />
        }
      </div>
    );
  }
});

module.exports = Overlays;