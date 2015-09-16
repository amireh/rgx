var React = require('react');
var Router = require('react-router');
var AppStore = require('AppStore');
var Root = require('./views/Root');
var Actions = require('Actions');
var $ = require('jquery');
var SPLASH_HIDE_DURATION = 500;

require('./config/codemirror');
require('./css/index.less');

var { Route, DefaultRoute, NotFoundRoute, HashLocation } = Router;

var router = Router.create({
  location: HashLocation,
  routes: [
    <Route name="root" path="/" handler={Root}>
      <DefaultRoute
        name="dialects"
        handler={require("./views/Dialects")}
      />

      <Route
        name="editor"
        path="/dialects/:dialect/?:permalink?"
        handler={require("./views/Editor")}
      />

      <Route
        name="registry"
        path="/browse/?:id?"
        handler={require("./views/Registry")}
      />

      <NotFoundRoute
        name="not-found"
        handler={require('./views/NotFound')}
      />
    </Route>,
  ]
});

router.run(function(Handler, state) {
  const $splash = $('.splash');

  Actions.clearTransientState();

  $splash.addClass('splash--hidden');

  setTimeout(function() {
    $splash.remove();
  }, SPLASH_HIDE_DURATION);

  React.render(<Handler {...state} />, document.querySelector("#__app__"));
});
