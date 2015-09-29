const React = require("react");
const Router = require("react-router");
const RouteActions = require("actions/RouteActions");
const getConfig = require("getConfig");
const ColorSchemeSwitcher = require("components/ColorSchemeSwitcher");
const ErrorNotifier = require("components/ErrorNotifier");
const Banner = require('components/Banner');
const AppStore = require('AppStore');
const Overlays = require('./Overlays');
const Heartbeat = require('Heartbeat');

const { RouteHandler } = Router;

const Root = React.createClass({
  mixins: [ Router.Navigation, Router.State ],

  getDefaultProps() {
    return {
      query: {},
      params: {}
    };
  },

  componentDidMount: function() {
    RouteActions.assignDelegate(this);
    AppStore.addChangeListener(this.reload);
    Heartbeat.addChangeListener(this.reload);
    Heartbeat.check();
  },

  componentWillUnmount: function() {
    Heartbeat.removeChangeListener(this.reload);
    AppStore.removeChangeListener(this.reload);
    RouteActions.assignDelegate(undefined);
  },

  render() {
    return (
      <div className="root">
        <Banner
          path={this.props.path}
          dialect={this.props.params.dialect}
          query={this.props.query}
        />

        <div className="root__content">
          <ErrorNotifier
            error={AppStore.getLatestError()}
            internalError={AppStore.getLatestInternalError()}
          />

          <RouteHandler
            onChange={this.reload}
            config={getConfig()}
            {...this.props}
          />
        </div>

        <div className="root__overlays">
          <Overlays {...this.props} />
        </div>

        <ColorSchemeSwitcher />
      </div>
    );
  },

  reload: function() {
    this.forceUpdate();
  },
});

module.exports = Root;