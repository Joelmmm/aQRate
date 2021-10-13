const path = require('path');
const TransformExtensionManifestPlugin = require('./webpack_helpers/TransformExtensionManifestPlugin');
const CopyPlugin = require("copy-webpack-plugin");
require('dotenv').config();

const IS_PRODUCTION = (process.env.MODE).toLowerCase() === "production";
const IS_DEVELOPMENT = (process.env.MODE).toLowerCase() === "development";

const config = {
  mode: process.env.MODE,
  entry: {
    background: './background.js',
    popup: './popup/aQRate.js',
    options: './options_page/options.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    clean: true
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env'],
            plugins: [["transform-remove-console", {
              exclude: IS_PRODUCTION ? ["error"] : ["error", "warn", "log"]
            }]]
          }
        }
      }
    ]
  },

  plugins: [
    new TransformExtensionManifestPlugin(),
    new CopyPlugin({
      patterns: [
        { from: path.resolve('popup/aQRate.html'), to: path.resolve('build') },
        { from: path.resolve('options_page/options.html'), to: path.resolve('build') },
        { from: path.resolve('icons'), to: path.resolve('build/icons') },
      ],
    })
  ]
};

if (IS_DEVELOPMENT) {
  config.devtool = 'inline-source-map';
}

module.exports = config;