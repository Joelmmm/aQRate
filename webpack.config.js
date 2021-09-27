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

  mode: 'development',
  devtool: 'inline-source-map',
};