const React = require('react');
const Overlay = require("components/Overlay");
const Cheatsheet = require("components/Cheatsheet");
const PublishingModal = require("./Overlays/PublishingModal");
const RouteActions = require('actions/RouteActions');
const $ = require('jquery');

const Overlays = React.createClass({
  getDefaultProps() {
    return {
      query: {},
      params: {}
    };
  },

  componentDidMount: function() {
    this.setupBodyForOverlaysIfPresent();
  },

  componentDidUpdate: function(prevProps, prevState) {
    this.setupBodyForOverlaysIfPresent();
  },

  render: function() {
    if (this.props.query.publishing) {
      return (
        <Overlay onClose={this.dismissPublishingModal} title="Publish Construct">
          <PublishingModal
            onClose={this.dismissPublishingModal}
            dialect={this.props.params.dialect}
          />
        </Overlay>
      );
    }
    else if (this.props.query.cheatsheet ) {
      return (
        <Overlay
          onClose={this.dismissCheatsheet}
          title={`${this.props.query.cheatsheet} Cheatsheet`}
        >
          <Cheatsheet dialect={this.props.query.cheatsheet} />
        </Overlay>
      );
    }
    else {
      return null;
    }
  },

  hasOverlay() {
    return (
      !!this.props.query.cheatsheet ||
      !!this.props.query.publishing
    );
  },

  setupBodyForOverlaysIfPresent() {
    $(document.body).toggleClass('body--overlain', this.hasOverlay());
  },

  dismissCheatsheet() {
    RouteActions.updateQuery({ cheatsheet: undefined });
  },

  dismissPublishingModal() {
    RouteActions.updateQuery({ publishing: undefined });
  }
});

module.exports = Overlays;