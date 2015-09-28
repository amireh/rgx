var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var path = require('path');
var modRewrite = require('connect-modrewrite');
var rgxConfig = require('../config');
var webpackConfig = require('../webpack.config');
var ROOT = path.join(__dirname, '..');

module.exports = function(app) {
  var compiler = webpack(webpackConfig);
  var port = rgxConfig.WEBPACK_DEVSERVER_PORT;
  var host = rgxConfig.WEBPACK_DEVSERVER_HOST;

  var server = new WebpackDevServer(compiler, {
    contentBase: path.resolve(ROOT, 'www'),
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    quiet: false,
    noInfo: true,
    lazy: false,
    inline: false,
    watchDelay: 300,
    stats: { colors: true },
    historyApiFallback: false,
  });

  server.listen(port, host, function(err) {
    if (err) {
      console.error(err);
    }

    console.log('Hot server listening at ' + host +':'+ port);
  });

  app.use(modRewrite([
    '^/index.js$ http://' + host + ':' + port + '/index.js [P]',
    '^/vendor.js$ http://' + host + ':' + port + '/vendor.js [P]',
    '^/(.*).hot-update.(js|json)$ http://' + host + ':' + port + '/$1.hot-update.$2 [P]'
  ]));
};