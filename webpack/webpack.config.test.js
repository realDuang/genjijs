const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './test/test.js',
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname, '..', 'dist')
  },
  devtool: 'eval',
  devServer: {
    contentBase: path.resolve(__dirname, '..', 'dist'),
    compress: true,
    port: 8083
  },
  plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
  resolve: {
    alias: {},
    extensions: ['.js', '.json', '.css']
  }
};
