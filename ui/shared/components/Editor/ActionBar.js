const React = require("react");
const Button = require('components/Button');
const Icon = require('components/Icon');
const Actions = require('Actions');
const RouteActions = require('actions/RouteActions');
const { Link } = require('react-router');

const ActionBar = React.createClass({
  displayName: "ActionBar",

  render() {
    return(
      <div className="editor-actionbar">
        {(
          <Button
            disabled={!this.props.canPermalink}
            onClick={this.generatePermalink}
            title={
              "Generate a URL that you can use to re-visit this construct."
            }
          >
            <Icon className="icon-link" /> Permalink
          </Button>
        )}

        {' '}

        {(
          <Button
            disabled={!this.props.canPublish}
            onClick={this.publish}
            title="Share this construct with people by adding it to the registry."
          >
            <Icon className="icon-earth" /> Publish
          </Button>
        )}

        {' '}

        {this.props.canEditExternally && (
          <Link
            className="btn"
            to="editor"
            params={{
              dialect: this.props.dialect,
              permalink: this.props.permalink
            }}
          >
            Edit
          </Link>
        )}
      </div>
    );
  },

  generatePermalink: function() {
    Actions.generatePermalink(this.props.dialect);
  },

  publish() {
    RouteActions.updateQuery({ publishing: true });
    // Actions.publish(this.props.dialect, true);
  }
});

module.exports = ActionBar;