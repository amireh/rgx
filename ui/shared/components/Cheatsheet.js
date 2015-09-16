var React = require('react');
var appStore = require('AppStore');
var $ = require('jquery');
var RouteActions = require('actions/RouteActions');

const BODY_MARKER = 'with-cheatsheet';

var Cheatsheet = React.createClass({
  propTypes: {
    dialect: React.PropTypes.string
  },

  componentDidMount: function() {
    $(document.body).addClass(BODY_MARKER);
  },

  componentWillUnmount: function() {
    $(document.body).removeClass(BODY_MARKER);
  },

  render: function() {
    return (
      <div className="cheatsheet">
        {this.renderCheatSheet()}
      </div>
    );
  },

  renderCheatSheet() {
    const { dialect } = this.props;
    const cheatSheet = appStore.getCheatSheet(dialect);

    if (!cheatSheet) {
      return (
        <div key="prompt">
          <p>
            It appears we do not have a specific cheat sheet for {dialect},
            would you like to view the generic regex (PCRE) cheatsheet instead?
          </p>

          <ul>
            <li>
              <a onClick={this.showGenericCheatSheet}>Yes, show me the generic cheatsheet.</a>
            </li>
            <li>
              <a onClick={this.close}>No, close this window.</a>
            </li>
          </ul>
        </div>
      );
    }
    else {
      return (
        <div key="sheet" dangerouslySetInnerHTML={{__html: cheatSheet }} />
      );
    }
  },

  showGenericCheatSheet() {
    RouteActions.updateQuery({ cheatsheet: 'PCRE' });
  },

  close() {
    RouteActions.updateQuery({ cheatsheet: undefined });
  }
});

module.exports = Cheatsheet;