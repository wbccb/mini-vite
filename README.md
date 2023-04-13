> 本文基于vite 4.3.0-beta.1版本的源码进行手写

> 下面的代码分析文档同时同步到[个人博客](https://segmentfault.com/u/wbccb)中

# mini-vite项目创建的原因
1. 通过mini-vite，验证源码分析文章的整体逻辑是否准确
2. 通过mini-vite，检验源码分析是否有遗漏的细节
3. 通过mini-vite，明白整体构建的一些流程和知识点
4. 通过mini-vite，学习vite中一些好的代码写法




# 手写vite

## 版本1
版本1目标：处理html、css、js、vue等基础数据

### 基本流程
1. 使用Koa2创建本地服务
2. 托管静态资源
3. 拦截客户端请求，让浏览器能够识别文件
   1. 路径需要整理，比如`import {} from "vue"`无法识别`vue`这种裸模块路径
   2. 转化文件数据为js，比如`.vue`->`.js`,`.ts`->`.js`，涉及到拆分和转化
   3. 改变文件数据请求类型为`text/javascript`

### 拦截.js请求，进行裸模块的路径重写
1. 正常js文件，比如main.js替换裸模块的地址为/modeuls/vue，返回ctx.body替换后的数据
2. 不正常的文件，比如请求/modules开头时，去找对应的node_modules的package.json，找到真实的路径，进行请求，
然后获取内容，继续替换裸模块的地址为/modeuls/xx，返回ctx.body替换后的数据

### 拦截.vue请求，解析vue文件为多个文件
> 使用vue提供的compiler-sfc和complier-dom的库进行解析
1. 将vue文件解析出`<script>`、`<style>`、`<template>`
2. `<script>`: export default替换为const xx= 以及 替换裸模块的地址为/modeuls/xx，返回xxx?type=template和xxx?type=style
3. `<template>`: `<template>`返回的import触发再次请求，然后再解析出对应的<template>标签数据返回
4. `<style>`: `<script>`返回的import触发再次请求，然后再解析出对应的<style>标签数据返回


## 版本2
在上面版本1中，我们已经实现了重写裸模块路径以及解析vue文件
在源码分析中，我们还差
- 预构建(resolveId+onLoad)esbuild打包：commonjs->esmodule以及将多个import打包到一个文件中
- 请求拦截：插件transform转化，比如转化scss->css等逻辑
- 热更新：websocket以及accept等自定义处理

接下来我们在版本2中将尽可能完善这一部分的内容
