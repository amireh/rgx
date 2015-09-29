const React = require("react");
const Button = require("components/Button");
const Icon = require("components/Icon");
const $ = require('jquery');
const { AVAILABLE_SCHEMES, DEFAULT_SCHEME } = require("constants");
const Storage = require('core/Storage');

Storage.register('colorScheme', DEFAULT_SCHEME);

const ColorSchemeSwitcher = React.createClass({
  componentDidMount: function() {
    Storage.on('change', this.applyColorScheme);

    this.applyColorScheme();
  },

  componentWillUnmount: function() {
    Storage.off('change', this.applyColorScheme);
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

  applyColorScheme() {
    const $body = $(document.body);

    AVAILABLE_SCHEMES.forEach(function(possiblyCurrentScheme) {
      $body.removeClass(possiblyCurrentScheme);
    });

    $body.addClass(Storage.getItem('colorScheme'));
  },

  switchScheme: function() {
    let className = document.body.className;
    let nextScheme;

    AVAILABLE_SCHEMES.some(function(scheme, i) {
      if (className.indexOf(scheme) > -1) {
        nextScheme = AVAILABLE_SCHEMES[i+1] || AVAILABLE_SCHEMES[0];
        return true;
      }
    });

    Storage.setItem('colorScheme', nextScheme);
  }
});

module.exports = ColorSchemeSwitcher;