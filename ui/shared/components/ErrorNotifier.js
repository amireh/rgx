var React = require("react");
var Actions = require("Actions");

var ErrorNotifier = React.createClass({
  propTypes: {
    error: React.PropTypes.string
  },

  render() {
    var { error, internalError } = this.props;

    if (!error && !internalError) {
      return null;
    }

    return(
      <div className="error-notifier">
        {internalError && this.renderInternalError(internalError)}
        {error && this.renderError(error)}
      </div>
    );
  },

  dismiss: function() {
    ;
  },

  renderError: function(message) {
    return (
      <div>
        Error:
        {' '}
        <em className="error-notifier__message">{message}</em>
        {' '}
        <a onClick={Actions.dismissError}>Dismiss</a>
      </div>
    );
  },

  renderInternalError: function(message) {
    return (
      <div>
        Dang! An internal error has occured:
        {' '}
        <em className="error-notifier__message">{message}</em>
        {' '}
        <a onClick={Actions.dismissInternalError}>Dismiss</a>
      </div>
    );
  }
});

module.exports = ErrorNotifier;