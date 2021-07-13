/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const appVersion = require("child_process")
  .execSync("git describe --tags --abbrev=0")
  .toString();

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        APP_VERSION: JSON.stringify(appVersion)
      })
    ]
  },
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:3000"
      },
      "^/auth": {
        target: "http://localhost:3000",
        changeOrigin: false
      }
    }
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/assets/scss/variables";`
      }
    }
  }
};
