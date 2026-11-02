/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const appVersion = process.env.VUE_APP_VERSION || "local";

module.exports = {
  productionSourceMap: false,
  chainWebpack(config) {
    if (process.env.NODE_ENV === "production") {
      config.module.rules.delete("eslint");
    }
  },
  configureWebpack: {
    performance: {
      maxAssetSize: 400000,
      maxEntrypointSize: 520000,
      assetFilter(assetFilename) {
        return !/fontawesome\/webfonts\//.test(assetFilename);
      }
    },
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
        additionalData: `@use "~@/assets/scss/variables" as *;`,
        sassOptions: {
          silenceDeprecations: ["legacy-js-api"]
        }
      },
      sass: {
        additionalData: `@use "~@/assets/scss/variables" as *;`,
        sassOptions: {
          silenceDeprecations: ["legacy-js-api"]
        }
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
