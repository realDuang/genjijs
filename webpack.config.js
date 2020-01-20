let path = require('path');

module.exports = {
  entry: { index: './src/' },
  output: { filename: '[name].min.js', path: path.resolve('dist') },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    alias: {},
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
};
