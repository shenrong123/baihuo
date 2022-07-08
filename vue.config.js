module.exports = {
  baseUrl: "/",
  outputDir: "dist",
  assetsDir: "",
  pages: {
    index: {
      entry: "src/main",
      template: "public/index.html"
    }
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    open: true, //配置自动启动浏览器
    https: false,
    // before(app) {
    //   app.get("/api/token", (req, res, next) => {
    //     res.json(loginData);
    //   });
    // },
    // 直联后端时用
    // proxy: {
    //   '^/action|file|export/': {
    //     target: 'http://172.16.0.12:10280/api/resources',
    //   },
    // },
    // 通过 corestone 时用
    proxy: {
      "^/users|good/": {
        target: "http://192.168.31.39:3000",
        // target: "http://121.4.97.71:8001",
        changeOrigin: true, //是否跨域
        // pathRewrite: {
        //   "^/users": "users"
        // }
        // HOST: 172.16.0.20 testing.shrine-via-core-stone.cloudcare.cn
      }
    }
  }
};
