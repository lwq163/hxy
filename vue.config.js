'use strict'
const path = require('path') // 引入nodejs的path模块
const resolve = dir => path.join(__dirname, dir) // resolve方法用来加载路径
const name = '老板，我来' // 标题
const port = process.env.VUE_APP_PORT // 端口
const {CleanWebpackPlugin} = require('clean-webpack-plugin')// 清空发布目录

module.exports = {
  configureWebpack: {
    plugins: [
      // 清理目录
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["**/*",'./dist','./hxy_vue'],
      })
    ]
  },
  publicPath: '/', // 根域上下文目录
  lintOnSave: false,//是否在保存的时候使用 `eslint-loader` 进行检查。
  outputDir: 'hxy_vue', // 构建输出目录
  assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
  indexPath: 'index.html',
  filenameHashing: true,//文件名哈希
  productionSourceMap: false,
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,  
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://47.114.126.51:8789/`,
        // target: `http://192.168.2.57:8080`, //许家宝 
        // target: `http://192.168.2.25:8080`,	   //张晓东
        // target: `http://192.168.2.187:8080`,
        // target: `http://192.168.2.200:8080`,
        // target: `http://192.168.2.148:8080`,
        // target: `http://192.168.2.78:8080`, 	// 周宜俭
        // target: `http://192.168.2.224:8080`,
        target: `http://192.168.2.66:8080`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    disableHostCheck: true
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= name
        return args
      })
    config.resolve.alias
      .set('@', resolve('src'))                 // 引入文件时候“ @ ”符号就代表src
      .set('_c', resolve('src/components'))     // 引入组件文件夹中的文件就可以用“ _c ”代替src/components
      .set('_s', resolve('src/service'))        // 引入service中的文件就可以用“ _s ”代替src/service
      .set('_m', resolve('src/common'))         // 引入common中的文件就可以用“ _m ”代替src/common
    config.module 
      .rule('vue')
      .use('iview')
      .loader('iview-loader')
      .options({ prefix: false })
  }
}