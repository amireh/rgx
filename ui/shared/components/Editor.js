var React = require("react");
var Label = require('components/Label');
var Button = require('components/Button');
var CodeTextarea = require('components/CodeTextarea');
var HTabbedPanel = require('components/HTabbedPanel');
var Subject = require('./Editor/Subject');
var FlagPicker = require('./Editor/FlagPicker');
var ResultEmblem = require('./Editor/ResultEmblem');
var ActionBar = require('./Editor/ActionBar');
var Actions = require('Actions');
var EllipsifedText = require('components/EllipsifedText');
var { findWhere, pluck } = require('lodash');
var K = require('constants');

var EditorView = React.createClass({
  displayName: "EditorView",

  getDefaultProps: function() {
    return {
      pattern: '',
      flags: '',
      subjects: [],
      results: [],
      availableFlags: [],
      activeSubjectId: null,
      readOnly: false,
      showPermalink: true,
      showPublish: true,
    };
  },

  componentDidUpdate: function(prevProps) {
    if (this.props.activeSubjectId !== prevProps.activeSubjectId && !this.props.readOnly) {
      this.refs.subject.focus();
    }
  },

  render() {
    var availableFlagNames = pluck(this.props.availableFlags, 'name').join('');
    var hasInvalidPattern = this.props.results.some(function(subjectResult) {
      return subjectResult.result.status === K.RC_BADPATTERN;
    });

    const { readOnly } = this.props;
    const hasContent = (
      this.props.pattern.length > 0
      && this.props.subjects.filter((s) => s.text.length > 0).length > 0
    );

    return(
      <div className="editor">
        <form onSubmit={this.consume}>

          <div className="editor__pattern-and-flags">
            <Label className="flags-input-container" value="Flags">
              <CodeTextarea
                className=""
                onChange={this.updateFlags}
                value={this.props.flags}
                placeholder={availableFlagNames.substr(0,5)}
                options={{scrollbarStyle: null}}
                readOnly={readOnly}
              />
            </Label>

            <Label
              className="pattern-input-container"
              value={hasInvalidPattern ? this.renderPatternError() : "Pattern"}
            >
              <CodeTextarea
                readOnly={readOnly}
                onChange={this.updatePattern}
                value={this.props.pattern}
                placeholder="foo(.*)"
                autoFocus
              />
            </Label>
          </div>

          <HTabbedPanel
            inverted
            onChange={this.activateSubject}
            className="editor__subjects"
            contentKeys={pluck(this.props.subjects, 'id')}
            value={this.props.activeSubjectId}
          >
            {this.props.subjects.map(this.renderSubjectTab)}

            <HTabbedPanel.Tab key="controls" tabClassName="editor__subject-controls">
              {!readOnly && (
                <Button
                  className="editor__add-subject-btn"
                  onClick={this.addSubject}
                  children="+"
                  title="Add another subject"
                />
              )}
            </HTabbedPanel.Tab>

            <HTabbedPanel.Content>
              {this.props.activeSubjectId &&
                this.renderSubject(this.props.activeSubjectId)
              }
            </HTabbedPanel.Content>
          </HTabbedPanel>

          <ActionBar
            dialect={this.props.dialect}
            permalink={this.props.permalink}
            canEditExternally={readOnly}
            showPermalink={this.props.showPermalink}
            canPermalink={!readOnly && hasContent}
            showPublish={this.props.showPublish}
            canPublish={!readOnly && hasContent}
          />

          {!readOnly && <FlagPicker
            flags={this.props.availableFlags}
            value={this.props.flags}
            onChange={this.toggleFlag}
            dialect={this.props.dialect}
          />}
        </form>
      </div>
    );
  },

  renderSubjectTab: function(subject) {
    var result = findWhere(this.props.results, { subjectId: subject.id }) || {};
    var Tab = HTabbedPanel.Tab;

    return (
      <Tab key={subject.id} className="editor__subject-tab">
        {false &&
          <EllipsifedText>{subject.text}</EllipsifedText>
        }

        <ResultEmblem {...result.result} />
      </Tab>
    );
  },

  renderSubject: function(id) {
    var subject = findWhere(this.props.subjects, { id });
    var result = findWhere(this.props.results, { subjectId: id });

    if (!subject) {
      return null;
    }

    var { customAttrs } = subject;

    return (
      <div className="editor__subject" key={'subject-'+subject.id}>
        <Label value={"Subject " + subject.position}>
          <Subject
            readOnly={this.props.readOnly}
            ref="subject"
            onChange={this.updateSubject.bind(null, subject.id)}
            result={result ? result.result : undefined}
            {...customAttrs}
            {...subject}
          />
        </Label>
      </div>
    );
  },

  renderPatternError: function() {
    var error = this.props.results.filter(function(subjectResult) {
      return subjectResult.result.status === K.RC_BADPATTERN;
    })[0].result.message;

    return (
      <EllipsifedText className="editor__pattern-error">
        Error: {error}
      </EllipsifedText>
    );
  },

  consume(e) {
    e.preventDefault();
  },

  updateFlags: function(newFlags) {
    Actions.updateFlags(this.props.dialect, newFlags);
  },

  toggleFlag: function(e) {
    var name = e.target.value;
    var isOn = e.target.checked;
    var flags = this.props.flags || '';

    if (isOn && flags.indexOf(name) === -1) {
      this.updateFlags(flags + name);
    }
    else if (!isOn && flags.indexOf(name) !== -1) {
      this.updateFlags(flags.replace(name, ''));
    }
  },

  updatePattern(newPattern) {
    Actions.updatePattern(this.props.dialect, newPattern);
  },

  submitConstruct: function() {
    Actions.submit(this.props.dialect);
  },

  addSubject: function(e) {
    e.stopPropagation();

    if (this.props.activeSubjectId) {
      Actions.updateSubjectAttrs(
        this.props.activeSubjectId,
        this.refs.subject.getCustomAttributes()
      );
    }

    Actions.addSubject();
  },

  activateSubject: function(id) {
    if (this.props.activeSubjectId) {
      Actions.updateSubjectAttrs(
        this.props.activeSubjectId,
        this.refs.subject.getCustomAttributes()
      );
    }

    Actions.activateSubject(id);
  },

  updateSubject: function(id, newText, customAttrs) {
    Actions.updateSubjectAttrs(id, customAttrs);
    Actions.updateSubjectText(this.props.dialect, id, newText);
  },
});

module.exports = EditorView;