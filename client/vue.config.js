/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const appVersion = process.env.VUE_APP_VERSION || "local";

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
  },
  pluginOptions: {
    i18n: {
      localeDir: "locales",
      enableInSFC: false,
      enableBridge: false
    }
  }
};
