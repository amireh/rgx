var React = require("react");
var EditorView = require('components/Editor');
var appStore = require('AppStore');
var EditorStore = require('EditorStore');
var ResultStore = require('ResultStore');
var Actions = require('Actions');

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
    var dialect = this.getDialect();

    return(
      <EditorView
        dialect={dialect}
        pattern={EditorStore.getPattern()}
        subjects={EditorStore.getSubjects()}
        flags={EditorStore.getFlags()}
        meta={EditorStore.getMeta()}
        activeSubjectId={EditorStore.getActiveSubjectId()}
        availableFlags={appStore.getAvailableFlags(dialect)}
        results={ResultStore.getAll()}
        permalink={ResultStore.getPermalink()}
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