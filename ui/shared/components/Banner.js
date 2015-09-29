const React = require("react");
const Icon = require("components/Icon");
const DialectPicker = require("components/DialectPicker");
const { Link } = require("react-router");
const Popup = require('qjunk/lib/Popup');
const AppStore = require('AppStore');
const RouteActions = require('actions/RouteActions');

var BannerItem = React.createClass({
  render() {
    return (
      <div
        className="banner__navigation-item"
        children={this.props.children}
        onClick={this.props.onClick}
      />
    )
  }
});

var Banner = React.createClass({
  propTypes: {
    dialect: React.PropTypes.string,
    query: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      query: {}
    };
  },

  componentDidUpdate: function(prevProps) {
    if (this.refs.popup) {
      if (prevProps.path !== this.props.path) {
        this.closeDialectPickerPopup();
      }
      else {
        this.refs.popup.reposition();
      }
    }
  },

  render() {
    var dialect = decodeURIComponent(this.props.dialect || '');

    return(
      <div className="banner-wrapper">
        <header className="banner">
          <h1 className="banner__logo">
            <Link to="/">
              <span className="banner__logo-highlight">
                [
              </span>
              :rgx:
              <span className="banner__logo-highlight">
                ]
              </span>
            </Link>
          </h1>

          <p className="banner__motto">
            <em>Express</em> yourself.
          </p>

          <nav className="banner__navigation">
            <Popup
              ref="popup"
              content={DialectPicker}
              activeDialect={dialect}
              availableDialects={AppStore.getAvailableDialects()}
              onClick={this.closeDialectPickerPopup}
              popupOptions={
                {
                  position: {
                    my: 'top center',
                    at: 'bottom center',
                    offset: {
                      y: -10
                    }
                  }
                }
              }
            >
              <BannerItem>
                <Icon className="icon-arrow-down" />
                {' '}
                <a>{dialect || 'Choose a Dialect'}</a>
              </BannerItem>
            </Popup>

            {dialect.length > 0 &&
              <BannerItem>
                <Icon className="icon-book" />{' '}
                <a
                  href="#"
                  onClick={this.toggleCheatsheet}
                  className={this.props.query.cheatsheet ? 'active' : undefined}
                >
                  Cheatsheet
                </a>
              </BannerItem>
            }

            <BannerItem>
              <Icon className="icon-cube" />{' '}
              <Link to="registry">Browse</Link>
            </BannerItem>
          </nav>
        </header>
      </div>
    );
  },

  toggleCheatsheet(e) {
    e.preventDefault();

    RouteActions.updateQuery({
      cheatsheet: !!this.props.query.cheatsheet ?
        undefined :
        this.props.dialect
    });
  },

  closeDialectPickerPopup() {
    this.refs.popup.close();
  }
});

module.exports = Banner;