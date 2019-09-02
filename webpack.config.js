const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInjector = require("html-webpack-injector");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  // entry snake_case is needed for bundle insertion to head by HtmlWebpackInjector
  // eslint-disable-next-line @typescript-eslint/camelcase
  entry: { bundle: "./src/index.ts" },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.template.html",
      chunks: ["bundle"]
    }),
    new HtmlWebpackInjector(),
    new CopyPlugin([
      "src/manifest.json",
      "images/**/*",
      "src/wsmain.js",
      "src/serviceWorker.js"
    ])
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    // compress: true,
    port: 8000,
    writeToDisk: true
  }
};
