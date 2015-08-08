const React = require('react');
const Actions = require('Actions');
const AppStore = require('AppStore');
const ErrorNotifier = require("components/ErrorNotifier");

const PublishingModal = React.createClass({
  getInitialState: function() {
    return {
      errors: {}
    };
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this.reload);
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this.reload);
  },

  render: function() {
    const { errors } = this.state;

    return (
      <form onSubmit={this.consume}>
        <ErrorNotifier
          error={AppStore.getLatestError()}
          internalError={AppStore.getLatestInternalError()}
        />

        <label className="form-label">
          <span className="form-label__caption">
            Description
          </span>

          {errors.description && (
            <p className="form-label__error">
              Please provide a brief description.
            </p>
          )}

          <div className="form-label__widget">
            <input
              autoFocus
              className="form-input"
              type="text"
              placeholder="A brief description of this construct"
              ref="c_description"
            />
          </div>
        </label>

        <label className="form-label">
          <span className="form-label__caption">
            Your name (or an alias)
          </span>

          {errors.author && (
            <p className="form-label__error">
              You must provide your name or some nickname.
            </p>
          )}

          <div className="form-label__widget">
            <input className="form-input" type="text" ref="c_author" />
          </div>
        </label>

        <input className="btn" type="submit" onClick={this.save} />
      </form>
    );
  },

  consume(e) {
    e.preventDefault();
  },

  save() {
    const description = this.refs.c_description.getDOMNode().value;
    const author = this.refs.c_author.getDOMNode().value;

    let errors = {};

    if (description.length <= 3) {
      errors['description'] = true;
    }

    if (author.length === 0) {
      errors['author'] = true;
    }

    if (Object.keys(errors).length === 0) {
      this.setState({ errors: {} });

      Actions.publish(this.props.dialect, {
        author: author,
        description: description,
        public: true
      }, this.props.onClose);
    }
    else {
      this.setState({ errors });
    }
  },

  reload() {
    this.forceUpdate();
  }
});

module.exports = PublishingModal;