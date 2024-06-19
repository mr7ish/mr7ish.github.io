---
createTime: 2023-04-10
tags:
  - 小程序
cover: /that girl,that cat.png
---

## 小程序：

### 文件构成：

pages	页面	

每个页面以文件夹形式存在，每个文件夹由(wxml、wxss、js、json )四个文件组成，页面级别的配置会覆盖全局的配置

utils	工具方法文件

app.js	项目入口文件

app.wxss	全局样式文件

app.json	全局配置文件	[官方文档](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE)

```json
{
  // 页面路径
  "pages": [
    // 未指定 entryPagePath 时，数组的第一项代表小程序的初始页面（首页）
    // 小程序中新增/减少页面，都需要对 pages 数组进行修改  
    "pages/home/home",	// 可以在这里新建页面，只需写好页面的路径即会自动生成该页面对应的文件夹
    "pages/index/index",
    "pages/logs/logs"	// 只有数据之间才有逗号(,)最后一项没有	这里加逗号会报错
  ],
  // 设置小程序的状态栏、导航条、标题等	
  "window": {
	"enablePullDownRefresh": true,	// 允许下拉刷新
  	"backgroundTextStyle": "dark"	// 下拉刷新loading的样式
  },
  ...	
}
```



小程序图标 icon 建议 81px * 81px

与pages同级目录下建 image 文件夹，将图标命名 ( icon-tab1.png、icon-tab1-active.png ) 都放进去



### 小程序中的组件：

`<view></view>`	对应	`<div></div>`

`<text></text>`	对应	`<span></span>`

`<navigator url=""></navigator>`	对应	`<a href=""></a>`

`<image></image>`	对应	`<img />`

<!--图片会有默认宽 320px 高 240px，需根据需求自己设置样式-->

`<other></other>`



### 相对路径：

- `./` 代表当前目录 ` <img src = "./img/icon.jpg" />` 等同于`<img src = "img/icon.jpg" />`
- `../` 代表上一级目录
-  `/` 指的是**当前根目录**，是相对目录；`<img src = "/img/icon.jpg" />`



### 小程序新增尺寸单位	rpx ( responsive pixel )：

可以根据屏幕宽度进行自适应

一般以iphone6的尺寸作为标准

​	规定屏幕宽度为 750 rpx，iPhone6屏幕宽度为 375px，有750个物理像素

​	750 rpx =  375 px = 750 物理像素

​	1 rpx = 0.5 px = 1 物理像素

​	1 px = 2 rpx



### 目前支持的选择器：

- .class	类
- #id        id
- element    元素
- element , element    并集
- ::after   在元素前插入内容
- ::before  在元素后插入内容



### @import	导入外联样式表：

​	/**  common.wxss文件 **/

​	`.font-blue {  color: blue;  }`



​	/**  app.wxss文件 **/
​	`@import "common.wxss";`

​	`.font-green { color: green; }`



### 对图片进行裁剪：	

`<image mode=""></image>`

默认值为 scaleToFill	

[image官方文档](https://developers.weixin.qq.com/miniprogram/dev/component/image.html)

| mode值       | 说明                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| scaleToFill  | 缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素                                                                |
| aspectFit    | 缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。                                       |
| aspectFill   | 缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。 |
| widthFix     | 缩放模式，宽度不变，高度自动变化，保持原图宽高比不变                                                                                 |
| heightFix    | 缩放模式，高度不变，宽度自动变化，保持原图宽高比不变                                                                                 |
| top          | 裁剪模式，不缩放图片，只显示图片的顶部区域                                                                                           |
| bottom       | 裁剪模式，不缩放图片，只显示图片的底部区域                                                                                           |
| center       | 裁剪模式，不缩放图片，只显示图片的中间区域                                                                                           |
| left         | 裁剪模式，不缩放图片，只显示图片的左边区域                                                                                           |
| right        | 裁剪模式，不缩放图片，只显示图片的右边区域                                                                                           |
| top left     | 裁剪模式，不缩放图片，只显示图片的左上边区域                                                                                         |
| top right    | 裁剪模式，不缩放图片，只显示图片的右上边区域                                                                                         |
| bottom left  | 裁剪模式，不缩放图片，只显示图片的左下边区域                                                                                         |
| bottom right | 裁剪模式，不缩放图片，只显示图片的右下边区域                                                                                         |



<!-- wxss文件里的图片只能来源于服务器或图床，不能放在文件结构里 -->



### 数据绑定：

在 js 文件中的 Page 对象的  data 对象里添加变量

`data: {​	name: '张三' }`

在 wxml 文件可以用 `{{ name }}` 渲染变量

```html
<!-- .wxml -->
<navigator id="item-{{id}}" class="{{itemclass}}" url="{{itemurl}}" >
  <image style="width: {{imagewidth}}" mode="{{imagemode}}" src="{{imagesrc}}"></image>
</navigator>
```

```js
// .js
data: {
  id: 233,
  itemurl:"/pages/home/imgshow/imgshow",
  itemclass:"event-item",
  imagesrc: "https://hackwork.oss-cn-shanghai.aliyuncs.com/lesson/weapp/4/weapp.jpg",
  imagemode:"widthFix",
  imagewidth:"100%",
}
```



### 列表渲染：

循环 companys 数组

```html
<view wx:for="{{ companys }}" wx:key="*this">
  {{ item }}
</view>
```

默认下标变量名为 index，当前项为 item

可用 wx:for-item 自定义当前项的名称 ， wx: for-index 自定义当前下标的名称

```html
<view wx:for="{{ companys }}" wx:for-item="company" wx:for-index="customIndex" wx:key="*this">
  {{ company }}
</view>
```



### 条件渲染：

```html
<view wx:if="{{ condition }}">条件为真显示，为假不渲染</view>
<view wx:elif="{{ condition2 }}">条件2为真显示，为假不渲染</view>
<view wx:else>其他条件都不满足时渲染</view>
```



### hidden：（ 相当于 vue 中的  v-show ）

```html
<view hidden="{{ true }}">不显示，但会渲染</view>	
<view hidden>作用同上</view>
```



### block标签：

仅仅只是一个包装元素，不会在页面中做任何渲染，只接受控制属性。( 同 vue 中 的 template )

```html
<block wx:if="{{ show }}">
  <view> 内容一 </view>
  <view> 内容二</view>
</block>
```



### some 小程序配置方法：

1.配置没有 tabBar 的小程序：

`删掉 app.json 中的 tabBar 配置项即可`

2.下拉小程序不出现空白：

`在 window 配置项里`

`"window": {
  "navigationBarBackgroundColor": "#ff0000",
  "backgroundColor": "#ff0000"
}`

`将 backgroundColor 和 navigationBarBackgroundColor 的颜色设为一样` 

3.整个页面背景变色：

`在 wxss 文件里添加`

`page { background-color: #ff0000} 样式`

4.自定义顶部导航栏：

`"window": { "navigationStyle" : "custom" }`



### 模板：

如果有一个部分在很多页面都有，可以使用模板

定义时用 name = "模板名"，使用时用 is = "模板名"

在 pages 文件夹下新建一个 commons 文件夹，在 commons 文件夹里新建一个 head.wxml 文件

```xml
<template name="head">
  <view class="page-head">
    <view class="title" style="text-align:center;font-size:12px;">{{ diffContent }}<view>
  </view>
</template>
```

在要引入的页面顶部用 import 引入模板

```xml
<import src = "/pages/commons/head.wxml" />
```

在要显示的地方调用，如页面最顶部

```xml
<template is="head" />
```

每个页面的标题可能不一样，如要动态渲染，可在不同页面的 data 里定义相关变量



### 页面路由：

Navigator 组件不同的 open-type 值 与 对应的 API 作用相同，但 API 更灵活。

| API              | **Navigator open-type值 ** | 含义                                                                 |
| ---------------- | -------------------------- | -------------------------------------------------------------------- |
| **redirectTo**   | redirect                   | 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。 |
| **navigateTo**   | navigate                   | 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。     |
| **navigateBack** | navigateBack               | 关闭当前页面，返回上一页面或多级页面。                               |
| **switchTab**    | switchTab                  | 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。                   |
| **reLaunch**     | reLaunch                   | 关闭所有页面，打开到应用内的某个页面。                               |



### 通过事件修改 data 里的值：

```js
data: {
    num: 0
}

evtHandler: function () {
    this.setData( {
		num: 100
    } )
}

//	wxml文件
//<button bindtap="evtHandler"></button>
```



### currentTarget 事件对象：当前的事件对象	 类 似 target

```js
data: {
	activeIndex: 0
}

clickEvt: function (e) {
	this.setData ( {
		activeIndex: e.currentTarget
	})
}
```



### 获取 URL参数的生命周期 onLoad：

onLoad 是 page 页面的生命周期函数，当页面加载时触发，一个页面只调用一次。

可以在 onLoad 函数的参数中获取当前页面路径中的参数

```js
<navigator url="./../home/detail/detail?title=标题&msg=消息通知">

onLoad: function (options) {
    console.log(options)
    // { title: "标题", msg: "消息通知" }
}


```



### 自定义属性	dataset：

自定义数据用 data- 开头，多个单词用 - 连接

```js
//	<view data-index="1" bindtap="clickHandler">

clickHandler: function (e) {
	console.log(e.currentTarget.dataset.index);
}

// 可用 view[data-index] 属性选择器添加样式
//	view[data-index] { margin: 30px; }
```



### 生命周期：

分为 App 和 Page 部分：

```js
App({
    //	小程序初始化调用
    onLaunch (options) { },
    //	小程序启动或切换到前台时调用
	onShow (optinos) { },    
    //	小程序切换到后台时调用
    onHide () { },
    //	错误监听
    onError (msg) { },
    //	页面不存在监听
    onPageNotFound () { },
    //	未处理的 Promise 拒绝事件监听函数
    onUnhandledRejection () { },
    //	监听系统主题变化
    onThemeChange () { }
})



Page({
    //	监听页面加载
    onLoad (options) { },
    //	监听页面显示
    onShow () { },
    //	监听页面初次渲染完成
    onReady () { },
    //	监听页面隐藏
    onHide () { },
    //	监听页面卸载
    onUnload () { },
    //	监听用户下拉操作
    onPullDownRefresh () { },
    //	页面上拉触底事件函数
    onReachBottom () { },
    //	监听转发
    onShareAppMessage () { },
    //	页面滚动触发事件函数
    onPageScroll () { },
    //	页面尺寸改变时触发
    onResize () { },
    //	当前是 tab 页时，点击 tab 时触发
    onTabItemTap () { }
})
```



### 全局变量：

```js
//	app.js 
App({
    globalData: {
    	name: 'zs',
        age: 23
    }
    
    
})

//	在页面级别的 js 文件中
//	通过 getApp() 获取唯一的 App 实例
const app = getApp()
console.log( app.globalData.name )
```



### 获取用户信息：

```xml
<button open-type="getUserInfo" bindgetuserinfo="getUserInfo">获取用户信息</button>

<!--
	getUserInfo (e) {
		console.log(e.detail.userinfo)
	} 		
-->
```



### 数据缓存：

```js
// 同步
wx.setStorageSync()
wx.getStorageSync()

//异步
wx.setStorageAsync()
wx.getStorageAsync()

```



### 网络请求：	

[官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html) 

```js
wx.request({
	url: '',	//请求路径
	header: {	//请求头
		'content-type': 'application/json'
	},
    data: { },	//请求参数
    timeout: 60000,	//超时时间	单位ms，默认60000
    method: 'POST',	//请求方式，默认GET
    dataType: 'json',	//返回的数据格式	json：会对返回的数据JSON.parse	其他：不进行JSON.parse
    responseType: 'text',	//响应的数据类型	text:响应的数据为文本	arraybuffer:为ArrayBuffer
	success(res) { },	//成功时的回调
    fail() { },	//失败时的回调
    complete() { }	//接口调用结束的回调（成功、失败都会执行）
})

```



### 富文本解析：

将富文本对象放在 nodes 里就可以将 HTML 标签解析

```xml
<rich-text nodes="{{ contents }}"></rich-text>
```
