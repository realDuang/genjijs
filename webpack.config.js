let path = require('path');

module.exports = {
  entry: { index: './src/' },
  output: { filename: '[name].min.js', path: path.resolve('dist') },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: /src/,
        exclude: /node_modules/
      }
    ]
  }
};
