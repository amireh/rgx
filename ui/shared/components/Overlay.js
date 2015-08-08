const React = require('react');

const Overlay = React.createClass({
  render: function() {
    return (
      <div className="overlay">
        <div className="overlay__controls">
          <h1>{this.props.title}</h1>

          <button
            className="btn overlay__closeButton"
            onClick={this.props.onClose}
          >
            CLOSE
          </button>
        </div>

        <div className="overlay__content">
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = Overlay;