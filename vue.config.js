const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const path = require("path");

module.exports = {
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      chunks: ["chunk-vendors", "chunk-common", "index"]
    },
    blog: {
      entry: "blog/main.js",
      template: "public/blog.html",
      //TODO: Can we reduce the amount of vendors?
      chunks: ["chunk-vendors", "chunk-common", "blog"]
    }
  },
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: "disabled"
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
        "@blog": path.resolve(__dirname, "blog/")
      }
    }
  }
};
