var React = require('react');
var CodeMirror = require('codemirror');
var { string, func, object } = React.PropTypes;
const { extend } = require('lodash');

var CodeTextarea = React.createClass({
  displayName: 'CodeTextarea',

  propTypes: {
    className: string,
    onChange: func.isRequired,
    value: string,
    placeholder: string,
    options: object
  },

  componentDidMount: function() {
    const options = extend({ readOnly: this.props.readOnly }, this.props.options);

    this.cm = CodeMirror.fromTextArea(this.refs.inputWidget.getDOMNode(), options);

    this.cm.on('change', () => {
      if (!this.cm.isClean() && this.cm.getValue() !== this.props.value) {
        this.props.onChange(this.cm.getValue());
      }
    });
  },

  componentWillUnmount: function() {
    this.cm = null;
  },

  componentDidUpdate: function() {
    if (this.props.value !== this.cm.getValue()) {
      this.cm.setValue(this.props.value);
      this.cm.markClean();
    }
  },

  render() {
    var className = `${this.props.className || ''} code-textarea`;

    return(
      <div className={className}>
        <textarea
          ref="inputWidget"
          value={this.props.value}
          placeholder={this.props.placeholder}
          autoFocus={this.props.autoFocus && !this.props.readOnly}
          readOnly
        />
      </div>
    );
  }
});

module.exports = CodeTextarea;