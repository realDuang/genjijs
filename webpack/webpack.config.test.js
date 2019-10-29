const path = require("path");

module.exports = {
  mode: "development",
  entry: "./test.js",
  //   output: {
  //     filename: "../../dist/dist.js",
  //     path: path.resolve("..", __dirname, "dist")
  //   },
  output: {
    filename: "dist.js",
    path: path.resolve(__dirname, "..", "dist")
  },
  devtool: "eval",
  devServer: {
    contentBase: path.resolve(__dirname, "..", "dist"),
    compress: true,
    port: 8083
  }
};
