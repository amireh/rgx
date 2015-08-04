var React = require("react");
var Button = require('components/Button');
var Icon = require('components/Icon');
var Actions = require('Actions');

var ActionBar = React.createClass({
  displayName: "ActionBar",

  render() {
    return(
      <div className="editor-actionbar">
        <Button
          onClick={this.generatePermalink}
        >
          <Icon className="icon-link" />
          {' '}
          Permalink
        </Button>
      </div>
    );
  },

  generatePermalink: function() {
    Actions.generatePermalink(this.props.dialect);
  }
});

module.exports = ActionBar;