const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const Critters = require("critters-webpack-plugin");
const path = require("path");

module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: "disabled"
      }),
      new Critters({})
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
