const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

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
    ]
  }
};
