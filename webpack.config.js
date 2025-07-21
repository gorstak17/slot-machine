const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/slotMachine.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  mode: "development",
  devtool: "source-map",
  devServer: 
  {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    
  host: '0.0.0.0',
allowedHosts: 'all',
  open: true,
  port: 8080,
  hot: true,
  liveReload: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name][ext]",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/assets", to: "assets" },
        { from: "src/styles.css", to: "styles.css" },
      ],
    }),

    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: true,
      filename: "index.html",
    }),
  ],
};
