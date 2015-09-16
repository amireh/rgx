var path = require("path");
var extend = require("lodash").extend;
var root = path.join(__dirname, '..', 'ui');

var nodeEnv = process.env.NODE_ENV;
var baseConfig = {
  devtool: nodeEnv === "production" ? null : "eval",

  resolve: {
    root: [
      path.resolve(__dirname, '..', 'node_modules'),
      path.resolve(__dirname, '..', 'ui', 'shims')
    ],

    fallback: [
      path.join(root, 'app', 'shared'),
      path.join(root, 'app', 'css'),
    ],

    modulesDirectories: [
      "css",
      "shared",
      "node_modules"
    ],
    alias: {
      "dialects": path.resolve(__dirname, "../dialects"),
      "qtip": path.resolve(__dirname, '..', 'ui', 'vendor', 'jquery.qtip.js')
    }
  },

  resolveLoader: {
    root: path.resolve(__dirname, "../node_modules")
  },

  module: {
    noParse: [],

    loaders: [
      {
        test: /\.js$/,
        exclude: [ /ui\/vendor/ ],
        include: [
          path.join(__dirname, '..', 'ui'),
          path.join(__dirname, '..', 'node_modules', 'qjunk', 'lib')
        ],

        loader: [ 'babel-loader', 'react-hot' ].join('!')
      },

      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },

      {
        test: /\.less$/,
        loader: 'style-loader!css-loader?importLoaders=1!less-loader'
      }
    ]
  }
};

module.exports = function(overrides) {
  return extend({}, baseConfig, overrides);
};
