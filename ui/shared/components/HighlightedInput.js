var React = require("react");
var CodeMirror = require('codemirror');
var { debounce } = require("lodash");
var { THROTTLE } = require("constants");

require('codemirror/mode/htmlmixed/htmlmixed');

var MATCH_HIGHLIGHT_OPTIONS = {
  className: 'highlighted-input__match'
};

var HighlightedInput = React.createClass({
  displayName: "HighlightedInput",

  getDefaultProps: function() {
    return {
      match: undefined,
      captures: [],
    };
  },

  componentDidMount: function() {
    this.cm = CodeMirror.fromTextArea(this.refs.inputWidget.getDOMNode(), {
      readOnly: this.props.readOnly
    });

    this.cm.on('change', () => {
      this.emitChange(this.cm.getValue());
    });

    this.highlight();
  },

  componentWillUnmount: function() {
    this.cm = null;
  },

  componentDidUpdate: function() {
    this.highlight();
  },

  render() {
    return(
      <div className="highlighted-input">
        <textarea
          ref="inputWidget"
          value={this.props.value}
          placeholder={this.props.placeholder}
          autoFocus={this.props.autoFocus}
          readOnly
        />
      </div>
    );
  },

  highlight: function() {
    var { cm } = this;
    var { match, captures } = this.props;
    var highlight = function(range, opts) {
      cm.markText(cm.posFromIndex(range[0]), cm.posFromIndex(range[1]), opts);
    };

    this.dehighlight();

    if (match) {
      highlight(match, MATCH_HIGHLIGHT_OPTIONS);
    }

    if (captures) {
      captures.forEach(function(capture, index) {
        highlight(capture, {
          className: `highlighted-input__capture gm-${index+1}`
        });
      });
    }
  },

  dehighlight: function() {
    this.cm.getAllMarks().forEach(function(mark) {
      mark.clear();
    });
  },

  focus() {
    if (!this.cm.hasFocus()) {
      this.cm.focus();
    }
  },

  setCursor(cursor) {
    this.cm.setCursor(cursor);
  },

  getCursor() {
    return this.cm.getCursor();
  },

  emitChange: debounce(function(value) {
    this.props.onChange(value);
  }, THROTTLE)
});

module.exports = HighlightedInput;