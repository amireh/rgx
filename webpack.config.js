var path = require("path");
var webpack = require("webpack");
var commonConfig = require("./webpack/common");
var rgxConfig = require('./config');
var nodeEnv = process.env.NODE_ENV || 'development';
var config = {
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(nodeEnv),
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
}

if (nodeEnv === 'production' && process.env.OPTIMIZE !== '0') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = commonConfig(config);

