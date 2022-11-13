## App项目流程

 App项目流程 1.	index.html页面添加不允许用户缩放```html<meta name="viewport" content="width=devicewidth,initialscale=1.0,userscalable=no">``` 2.	在main.js项目入口文件中（负责挂载虚拟DOM和实现业务注册等） 导...
<div></div>

[阅读更多](./notes/App项目流程.md)

## fastmock使用手册

 mock数据终极解决文档 ==解决问题：== 在开发中，后端的接口往往是较晚出来的，但是有时候我们必须给前端页面一些虚假的数据去开发，这个时候一些mock工具就很有必要了，最终我选择了`json server`工具，因为它足够简单，而且也能和你们所熟知的Mock.js 配合模拟数据 一、安装配置 jsonserver 1.1 安装...
<div></div>

[阅读更多](./notes/fastmock使用手册.md)

## git使用手册

 git使用手册 一、拉合作伙伴到本项目![image20220823174717113](https://typorazjf.osscnchengdu.aliyuncs.com/images/image20220823174717113.png) 二、创建分支1. 分支在创建仓库的时候就会有分支创建选项2. 配置默认的分支目录!...
<div></div>

[阅读更多](./notes/git使用手册.md)

## JS知识点

 this指向 不管我们给函数 `bind` 几次，`fn` 中的 `this` 永远由第一次 `bind` 决定`bind` 这些改变上下文的 API 了，对于这些函数来说，`this` 取决于第一个参数，如果第一个参数为空，那么就是 `window````jslet a = {}let fn = function () { console.log(...
<div></div>

[阅读更多](./notes/JS知识点.md)

## React

<div class="hide">%tag%React,JavaScript%tag%</div>React用脚手架创建项目用	npx  createreactapp  项目名npm是本地命令，npx是nodejs集成的远程命令React运行和构建最好用	yarn 而不是 npm安装 yarn ： npm i g yarn安装依赖	yarn 或...
<div><Tag type="info" text="React" /><Tag type="info" text="JavaScript" /></div>

[阅读更多](./notes/React.md)

## test新建文章

 测试新建文章...
<div></div>

[阅读更多](./notes/test新建文章.md)

## uni-app项目

 原生APP：（native APP）本地应用程序 *是指本地应用程序，也叫原生AP。内部运行的是二进制数据，也就是说原生语言最后是直接转换成二进制数据运行的，可以调用最底层的设备API。如手机摄像头、日历、设备信息等。* 网页应用APP：(web APP)，也叫移动APP *无法调用原生的功能，依赖于MOBILE BROWER( 移动设备中的浏览...
<div></div>

[阅读更多](./notes/uni-app项目.md)

## 微信小程序开发

 1. 小程序开发流程 微信小程序管理工具网址：https://mp.weixin.qq.com/ 1.	小程序开发完以后 2.	上传为体验版 3.	在小程序管理工具，成员管理处添加运营人员权限体验小程序 4.	小程序体验通过后，提交给微信官方工作人员审核发布上线 2.    文件类型（根据文档进行开发）...
<div></div>

[阅读更多](./notes/微信小程序开发.md)

## 状态管理器原理

 所有的状态管理器都是基于 flux 设计模式进行设计的：让数据变化可预测，数据流是单向的。 遵守三大原则：只读：数据只能读取（state数据不可以进行修改）唯一：数据源必须唯一（数据必须存储到一起）纯函数：修改数据的方法必须是纯函数（修改数据不能影响任何非作用域的数据）纯函数是指：纯函数也是一个工厂函数，它也要接收数据，然后返回数据...
<div></div>

[阅读更多](./notes/状态管理器原理.md)

## 编写代码规范

  变量命名语义化，不用注释即可见名知其义  不用的变量删掉  给参数添加变量说明  ```js  if (value.length < 8) { // 为什么要小于8，8表示啥？长度，还是位移，还是高度？  	....  }    const MAX_INPUT_LENGTH = 8;  if (value.lengt...
<div></div>

[阅读更多](./notes/编写代码规范.md)

## 面试和知识点问题

你从上家公司离职的原因？简历项目的时间要有重叠自我介绍咋说公司：​	畅加科技弹性布局怪异盒子和标准盒子...
<div></div>

[阅读更多](./notes/面试和知识点问题.md)

## 面试注意点

 去公司面试时的主观感受： 公司规模 谁面试你 技术岗人数 前端人数 后端人数 是否有UI设计人员 		福利待遇： 薪资多少 试用期多久 试用期是否交社保 试用期薪资打几折 天眼查查公司信息	百度知乎搜公司名字...
<div></div>

[阅读更多](./notes/面试注意点.md)
