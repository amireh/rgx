var React = require("react");
var EditorView = require('./components/EditorView');
var appStore = require('AppStore');
var editorStore = require('EditorStore');
var resultStore = require('ResultStore');
var Actions = require('Actions');

var Editor = React.createClass({
  displayName: "Editor",

  componentDidMount: function() {
    editorStore.addChangeListener(this.reload);
    resultStore.addChangeListener(this.reload);

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
    resultStore.removeChangeListener(this.reload);
    editorStore.removeChangeListener(this.reload);
  },

  render() {
    var dialect = this.getDialect();

    return(
      <EditorView
        dialect={dialect}
        pattern={editorStore.getPattern()}
        subjects={editorStore.getSubjects()}
        flags={editorStore.getFlags()}
        availableFlags={appStore.getAvailableFlags(dialect)}
        results={resultStore.getAll()}
        permalink={resultStore.getPermalink()}
        activeSubjectId={editorStore.getActiveSubjectId()}
      />
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