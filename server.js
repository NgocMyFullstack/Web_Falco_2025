const express = require("express");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");

const app = express();
const compiler = webpack(webpackConfig);

// Middleware cho Webpack
app.use(
  require("webpack-dev-middleware")(compiler, {
    publicPath: webpackConfig.output.publicPath,
  })
);

// Middleware cho HMR
app.use(
  require("webpack-hot-middleware")(compiler, {
    log: console.log,
    path: "/__webpack_hmr",
    heartbeat: 10 * 1000,
  })
);

// Khởi động server
app.listen(80, () => {
  console.log("Server is running on http://localhost:3000");
});
