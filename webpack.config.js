const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInjector = require("html-webpack-injector");

module.exports = {
  mode: "development",
  // entry snake_case is needed for bundle insertion to head by HtmlWebpackInjector
  // eslint-disable-next-line @typescript-eslint/camelcase
  entry: { bundle: "./src/index.ts", weather_head: "./src/weather.ts" },
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
      chunks: ["bundle", "weather_head"]
    }),
    new HtmlWebpackInjector()
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    // compress: true,
    port: 8000
  }
};
