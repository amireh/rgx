var React = require("react");
var EditorView = require('components/Editor');
var appStore = require('AppStore');
var EditorStore = require('EditorStore');
var ResultStore = require('ResultStore');
var Actions = require('Actions');
var { Link } = require('react-router');

var Editor = React.createClass({
  displayName: "Editor",

  componentDidMount: function() {
    EditorStore.addChangeListener(this.reload);
    ResultStore.addChangeListener(this.reload);

    if (this.props.params.permalink) {
      this.consumePermalink();
    }
  },

  componentDidUpdate: function(prevProps) {
    if (prevProps.params.permalink !== this.props.params.permalink) {
      this.consumePermalink();
    }
  },

  componentWillUnmount: function() {
    ResultStore.removeChangeListener(this.reload);
    EditorStore.removeChangeListener(this.reload);
  },

  render() {
    const dialect = this.getDialect();
    const generatedPermalink = ResultStore.getPermalink();
    const publishedConstruct = ResultStore.getPublishedConstruct();

    return(
      <div>
        {generatedPermalink && (
          <p>
            Your pattern can now be permanently viewed by visiting
            {' '}
            <Link
              to="editor"
              target="_blank"
              params={{
                dialect: generatedPermalink.dialect,
                permalink: generatedPermalink.href
              }}
            >
              this link
            </Link>
            .
            {' '}

            <em><a onClick={Actions.clearGenerationResults}>Dismiss</a></em>
          </p>
        )}

        {publishedConstruct && (
          <p>
            Your pattern has been published to the registry. You can view it
            {' '}
            <Link
              to="registry"
              target="_blank"
              params={{
                id: publishedConstruct.id
              }}
            >
              here
            </Link>.

            {' '}

            <em><a onClick={Actions.clearGenerationResults}>Dismiss</a></em>
          </p>
        )}

        <EditorView
          dialect={dialect}
          pattern={EditorStore.getPattern()}
          subjects={EditorStore.getSubjects()}
          flags={EditorStore.getFlags()}
          meta={EditorStore.getMeta()}
          activeSubjectId={EditorStore.getActiveSubjectId()}
          availableFlags={appStore.getAvailableFlags(dialect)}
          results={ResultStore.getAll()}
          permalink={generatedPermalink}
        />
      </div>
    );
  },

  reload: function() {
    this.props.onChange();
  },

  getDialect() {
    return decodeURIComponent(this.props.params.dialect);
  },

  consumePermalink() {
    Actions.retrievePermalink(this.props.params.permalink);
  }
});

module.exports = Editor;