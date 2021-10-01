const path = require('path');
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
  }
};


if (IS_DEVELOPMENT) {
  config.devtool = 'inline-source-map';
}


module.exports = config;