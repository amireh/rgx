var path = require("path");
var webpack = require("webpack");
var commonConfig = require("./webpack/common");
var rgxConfig = require('./config');
var nodeEnv = process.env.NODE_ENV || 'development';
var config = {
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(nodeEnv),
      "process.env.APP_ROOT": path.resolve(__dirname)
    })
  ],
  entry: {
    index: [ "./ui/index.js" ],
    vendor: [
      'react',
      'react-router',
      'codemirror',
      'lodash',
      'jquery',
      'qjunk'
    ]
  },

  output: {
    path: path.resolve(__dirname, "www"),
    filename: "[name].js",
    // publicPath: "http://localhost:8943/"
  },

};

if (process.env.NODE_ENV === "development") {
  var devServerPath = (
    'http://' +
    rgxConfig.WEBPACK_DEVSERVER_HOST + ':' +
    rgxConfig.WEBPACK_DEVSERVER_PORT
  );

  config.entry.index.unshift("webpack/hot/only-dev-server");
  config.entry.index.unshift('webpack-dev-server/client?' + devServerPath);
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  config.module.loaders.filter(function(loader) {
    return loader.type === 'js';
  })[0].loader += '!react-hot';
}

if (nodeEnv === 'production' && process.env.OPTIMIZE !== '0') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = commonConfig(config);

