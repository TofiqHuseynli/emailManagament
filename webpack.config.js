const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env, args) => {
  return {
    entry: path.resolve(__dirname, "src/index.js"),
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "[hash].bundle.js",
      publicPath: args.publicPath || "/",
    },
    devServer: {
      port: 4018,
      compress: true,
      publicPath: "/",
      host: "localhost",
      watchContentBase: true,
      historyApiFallback: true,
      contentBase: path.resolve(__dirname, "public"),
    },
    resolve: {
      symlinks: false,
      alias: {
        "@config": path.resolve(__dirname, "src/config"),
        "@actions": path.resolve(__dirname, "src/actions"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@layouts": path.resolve(__dirname, "src/layouts"),
        "@components": path.resolve(__dirname, "src/components"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  modules: false,
                },
              ],
              "@babel/preset-react",
            ],
            plugins: [
              "@babel/plugin-transform-runtime",
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-proposal-export-default-from",
            ],
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: false,
                localIdentName: "[local]__[hash:base64:6]",
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          use: "file-loader",
        },
        {
          test: /\.(jpg|png|gif|svg)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 10 * 1024,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        "process.env": {
          publicPath: JSON.stringify(args.publicPath),
          frameMode: args.frameMode,
        },
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public/index.ejs"),
        inject: "body",
        templateParameters: {
          MAIN_ORIGIN_URL: args.frameMode ? "" : "https://app.fogito.com",
        },
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, "public"),
          to: path.resolve(__dirname, "build"),
          ignore: ["index.ejs"],
        },
      ]),
    ],
  };
};