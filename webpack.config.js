let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: { test: './test/test.js' },
  output: { filename: '[name].js', path: path.resolve('dist') },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: /src/,
        exclude: /node_modules/
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
  resolve: {
    alias: {},
    extensions: ['.js', '.json', '.css']
  },
  devServer: {
    contentBase: './dist',
    host: 'localhost',
    port: 12580,
    hot: true
  }
};
