module.exports = {
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
