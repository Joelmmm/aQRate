const path = require('path');

module.exports = {
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
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },

  mode: 'development',
  devtool: 'inline-source-map',
};