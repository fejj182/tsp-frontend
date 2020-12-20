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
  chainWebpack: config => {
    config.plugins.delete("prefetch");
    config.plugin("preload").tap(options => {
      options[0].include = "allChunks";
      return options;
    });
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/helpers/variables.scss";`
      }
    }
  }
};
