const React = require("react");
const Button = require("components/Button");
const Icon = require("components/Icon");
const $ = require('jquery');
const { AVAILABLE_SCHEMES, DEFAULT_SCHEME } = require("constants");

const ColorSchemeSwitcher = React.createClass({
  componentDidMount: function() {
    $(document.body).addClass(DEFAULT_SCHEME);
  },

  render() {
    return(
      <Icon
        onClick={this.switchScheme}
        className="color-scheme-switcher icon-contrast"
        title="Switch Color Scheme"
      />
    );
  },

  switchScheme: function() {
    let className = document.body.className;
    let currScheme, nextScheme;

    AVAILABLE_SCHEMES.some(function(scheme, i) {
      if (className.indexOf(scheme) > -1) {
        currScheme = scheme;
        nextScheme = nextScheme || AVAILABLE_SCHEMES[i+1] || AVAILABLE_SCHEMES[0];
        return true;
      }
    });

    if (currScheme && nextScheme) {
      className = className.replace(currScheme, nextScheme);
    }
    else {
      className = DEFAULT_SCHEME;
    }

    document.body.className = className;
  }
});

module.exports = ColorSchemeSwitcher;