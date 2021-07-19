# vue-cli 3.0 模版 vue2.0

---

## 目录

```
┌─public
│  ├─favicon.ico  			icon图标
│  └─index.html             入口页面
├─src
│  ├─assets			        资源 存放一些不可变动的文件
│  │   ├─style              样式
│  │   │  └─common.scss     全局公用样式
│  │   ├─images             静态图片存放
│  │   └─font               字体
│  ├─common                 共用
│  │   ├─utils              小工具
│  │   │  ├─canvasFormat.js canvas转换文件工具
│  │   │  └─index.js        前端js工作集合
│  ├─components 	        组件目录
│  │   ├─bank               验证银行卡是否正确 & 返回所属银行名称（可以根据当前项目进行二次开发）
│  │   ├─sSimpleCrop        头像上传裁剪（推荐使用 可兼容移动&pc）
│  │   ├─sUpload            移动端上传头像裁剪
│  │   └─index.js           配置页面无需注册自定义组件
│  ├─request			    请求
│  │   ├─api                接口目录
│  │   │  └─index           中间件
│  │   ├─mock               模拟数据
│  │   │  ├─config          配置（开启/关闭 模拟数据）
│  │   │  └─index           数据列表
│  │   ├─index              请求拦截器
│  │   ├─jsencrypt          rsa加密
│  │   ├─statusCode         状态码组合
│  │   └─README.md          说明文档
│  ├─router			        路由
│  │   └─index              路由配置&路由守卫
│  ├─store			        状态管理工具
│  ├─views			        页面
│  ├─App.vue			    根组件
│  └─main.js                入口js文件
├─vue.config.js             vue 配置 例如 跨域配置等
├─.env                      本地环境 请求地址配置
├─.env.development          测试环境 请求地址配置
├─.env.production           生产环境 请求地址配置
├─.gitignore                git禁止上传配置文件
├─babel.config.js           按需引入组件
├─package.json              依赖版本管理器
├─package-lock.json         锁定依赖版本管理器
├─yarn-lock.json            yarn依赖版本管理器
└─README.md                 说明文档
```

---

## 安装

> 关于旧版本
> Vue CLI 的包名称由 vue-cli 改成了 @vue/cli。 如果你已经全局安装了旧版本的 vue-cli (1.x 或 2.x)，你需要先通过 npm uninstall vue-cli -g 或 yarn global remove vue-cli 卸载它。

> Node 版本要求
> Vue CLI 需要 Node.js 8.9 或更高版本 (推荐 8.11.0+)。你可以使用 nvm 或 nvm-windows 在同一台电脑中管理多个 Node 版本。

> 安装命令

```
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```

检查其版本是否正确 (3.x)：

```
vue --version
```

创建项目可以采用 图形化 创建 也可以采用命令创建 以下介绍 开启图形化创建界面 命令如下

```
vue ui
```

---

### 安装依赖

```
yarn install
# OR
npm install
```

### 启动

```
yarn serve
# OR
npm run serve
```

### 打包

```
yarn build  //本地环境打包
yarn build:dev  //测试环境打包
yarn build:pro  //开发环境打包
# OR
npm run build  //本地环境打包
npm run build:dev  //测试环境打包
npm run build:pro  //开发环境打包
```

---

### 接口请求

> 使用方法 看 `request/README.md`

---

### 工具集合调用

> 使用方法 看 `common/utils/README.md`

---

### 组件

> 所有组件使用方法 看 说明文档 `components/*/README.md`

---

### 如果运行项目 产生报错 `nprogress` 相关 解决办法如下

```
手动删除 `node_modules` 文件 并 重新下载依赖
# OR
命令：`rm -rf node_modules` 成功以后 重新下载依赖
```

---

### postcss 配置

> 项目自带 postcss 依赖 并 已经配置好 安装依赖 自动使用了 无需以下操作 **以下仅为参考配置 postcss 教程**

1、在 `public/index.html` 写入 meta

```
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0">
```

2、下载 lib-flexible，并在 main.js 中引用

```
npm i lib-flexible --save
```

3、安装自适应插件

```
npm i postcss-pxtorem --save
# OR
npm i postcss-px-to-viewport --save
```

4、修改 vue.config.js 配置文件（若项目中没有新建一个）

```
module.export = {
  lintOnSave: true,
  css: {
      loaderOptions: {
          postcss: {
              plugins: [
                  require('postcss-px-to-viewport')({ //配置项，详见官方文档 https://github.com/postcss/postcss/blob/master/README-cn.md
                      unitToConvert: 'px',// 默认值`px`，需要转换的单位
                        propList: ['*'],// 转化为vw的属性列表
                        viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750.
                        viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334.
                        unitPrecision: 3, // (指定`px`转换为视窗单位值的小数位数（很多时候无法整除).
                        viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw.
                        fontViewportUnit: 'vw',// 字体使用的视窗单位
                        selectorBlackList: ['.ignore','van'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名.
                        minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位
                        mediaQuery: false, // 允许在媒体查询中转换`px`.
                        replace: true, // 是否直接更换属性值而不添加备用属性
                        exclude: [], // 忽略某些文件夹下的文件或特定文件
                        landscape: false, // 是否添加根据landscapeWidth生成的媒体查询条件 @media (orientation: landscape)
                        landscapeUnit: 'vw',// 横屏时使用的单位
                        landscapeWidth: 568// 横屏时使用的视窗宽度
                  }), // 换算的基数
              ]
          }
      }
  },
}
```
