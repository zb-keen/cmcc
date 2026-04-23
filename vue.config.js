const path = require('path');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const CdnReplacePlugin = require("./script/cdn-replace-plugin");
const productionGzipExtensions = ["js", "css"];

const mock = require('./mock/index.js')
const assetsCDN = {
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'axios': 'axios'
  },
  js: [
    'https://cdn.bootcdn.net/ajax/libs/vue/2.6.14/vue.min.js',
    'https://cdn.bootcdn.net/ajax/libs/vue-router/3.5.1/vue-router.min.js',
    'https://cdn.bootcdn.net/ajax/libs/vuex/3.6.2/vuex.min.js',
    'https://cdn.bootcdn.net/ajax/libs/axios/1.3.6/axios.min.js',
  ]
}
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  publicPath: process.env.VUE_APP_BASE_URL, // 根地址，默认/
  outputDir: 'dist', // 打包目录
  assetsDir: 'assets', // 静态资源目录
  productionSourceMap: false, // 建议生产关闭
  devServer: {
    open: true,
    // host: '0.0.0.0',
    // port: '8081',
    // hot: true,
    // https: false,
    host: 'localhost',
    port: 8080,
    headers: { 'Connection': 'keep-alive' },
    // mock数据
    proxy: {
      '/apiProxy': {
        // target: 'http://localhost:8081',
        target: 'http://testpsie.op.coc.10086.cmos:8080',
        headers: { 'Connection': 'keep-alive' },
        changeOrigin: true,
        pathRewrite: {
          '^/apiProxy': ''
        }
      }
    },
    // 开发云桌面联调
    // proxy: {
    //   '/test': {
    //     // target: 'http://localhost:8081',
    //     // target: 'http://testpsie.op.coc.10086.cmos:8080',
    //     target: 'http://172.22.22.213:8080', // 宋红飞
    //     headers: { 'Connection': 'keep-alive' },
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/test': ''
    //     }
    //   }
    // },
    onBeforeSetupMiddleware: (devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      var keyValues = Object.keys(mock)
      keyValues.forEach(url => {
        devServer.app.post(url, (_, response) => {
          response.send(JSON.stringify(mock[url]));
        });
      })
    }
  },
  configureWebpack: (config) => {
    // config.plugins.push(new WorkboxPlugin.GenerateSW({
    //   skipWaiting: true,
    //   clientsClaim: true,
    //   exclude: [/\.map$/, /asset-manifest\.json$/, new RegExp(process.env.VUE_APP_API_URL)], // 排除需要缓存的 XHR 请求
    //   runtimeCaching: [
    //     {
    //       urlPattern: new RegExp(process.env.VUE_APP_BASE_URL + 'searchMain'), // 匹配路由地址
    //       handler: 'CacheFirst', // 缓存优先
    //       options: {
    //         navigateFallbackURL: process.env.VUE_APP_BASE_URL + 'index.html' // 缓存返回文件
    //       }
    //     }
    //   ]
    //   // importWorkboxFrom: 'local',
    // }));
    config.resolve.alias = {
      "@": resolve("src"),
    };
    // if(process.env.NODE_ENV !== 'development'){
    //   config.externals = assetsCDN.externals;
    // }
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              // 删除注释
              comments: false,
            },
            // 生产环境自动删除console
            compress: {
              // warnings: false, // 若打包错误，则注释这行
              drop_debugger: true, // 清除 debugger 语句
              drop_console: true, // 清除console语句
              pure_funcs: ["console.log"],
            },
          },
          sourceMap: false,
          parallel: true,
        }),
      );
    }
    // pk-prod 和 pk-gray 命令通过 DISABLE_GZIP 环境变量禁用 gzip
    if (process.env.DISABLE_GZIP !== 'true') {
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    }
    // CDN 资源路径替换插件 - 只在生产环境启用
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'gray' || process.env.NODE_ENV === 'pre') {
      config.plugins.push(
        new CdnReplacePlugin({
          cdnDomain: 'https://res.app.coc.10086.cn',
          baseUrl: '/ngpsie/psiesearchsdk',
          enabled: true
        })
      );
    }
    // 公共代码抽离
    config.optimization = {
      runtimeChunk: 'single', // 将运行时代码拆分到单独的 chunk，避免重复加载
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true // 是否使用已有的 chunk，如果为 true， 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
          }
        }
      }
    };
  },

  chainWebpack: (config) => {
    // gray、pre、prod 模式统一使用 js/ 和 css/ 目录
    if (process.env.NODE_ENV === 'gray' || process.env.NODE_ENV === 'pre' || process.env.NODE_ENV === 'production') {
      config.output.filename('js/[name].js').end();
      config.output.chunkFilename('js/[name].js').end();

      // 配置 CSS 文件名
      if (config.plugins.has('extract-css')) {
        config.plugin('extract-css').tap(args => {
          args[0].filename = 'css/[name].css';
          args[0].chunkFilename = 'css/[name].css';
          return args;
        });
      }
    }
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
    // if(process.env.NODE_ENV !== 'development'){
    //   config.plugin('html').tap(args => {
    //     args[0].cdn = assetsCDN
    //     return args
    //   })
    // }
    config.module
      .rule('scss')
      .test(/\.scss$/)
      .oneOf('vue')
      .use('px2rem')
      .loader('px2rem-loader')
      .before('postcss-loader')
      .options({
        remUnit: 75, // 设计稿的宽度的1/10
      }).end();
  },
}