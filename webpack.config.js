let path = require('path');

module.exports = {
  entry: { index: './src/' },
  output: {
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'Genji',
    filename: '[name].min.js',
    path: path.resolve('dist')
  },
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
