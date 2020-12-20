const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const path = require("path");

module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: "disabled"
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/")
      }
    }
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/helpers/variables.scss";`
      }
    }
  }
};
