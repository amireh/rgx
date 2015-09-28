var React = require("react");

var Icon = React.createClass({
  render() {
    return(
      <i
        className={"icon " + this.props.className}
        title={this.props.title}
        onClick={this.props.onClick}
      />
    );
  }
});

module.exports = Icon;