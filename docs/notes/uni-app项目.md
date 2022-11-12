## 原生APP：（native APP）本地应用程序

### *是指本地应用程序，也叫原生AP。内部运行的是二进制数据，也就是说原生语言最后是直接转换成二进制数据运行的，可以调用最底层的设备API。如手机摄像头、日历、设备信息等。*

## 网页应用APP：(web APP)，也叫移动APP

### *无法调用原生的功能，依赖于MOBILE BROWER( 移动设备中的浏览器 )运行，内部执行普通的网页代码，也可以理解为是网页在移动设备上执行。*

### *手机H5就是 web App，就是在手机浏览器上运行的页面。*

## 混合APP：（hybrid APP）混合应用

### *是上面两种方式的混合。结合两者居中的状态，比较适合现代开发。主要是通过web前端技术实现的，在一个原生APP内嵌一个轻量级的浏览器，然后使用 H5 开发一部分原生的功能，这部分功能可以在不升级APP的情况下动态更新。*



![img](https://img-blog.csdnimg.cn/20210428183017194.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQwNDA5MTQz,size_16,color_FFFFFF,t_70)



# uni-app开发：

### 老师接口文档地址：http://www.shuiyue.info:15666/swagger/#

# 样式：

## ！！！（ 一定不要用uni-xxx样式，编译到小程序不起作用 ，.uni同样 ）

## 用 image内置组件，要给图片加class才有用

## 内置组件要用class改它的样式

### 渲染图片的地址：在获取到的时候就用基础路径拼接，不要在渲染时拼接



登录业务逻辑：

<!-- ![image-20220908174703078](C:\Users\37734\AppData\Roaming\Typora\typora-user-images\image-20220908174703078.png) -->



##  使用uni-app中的API方法时注意this指向，如果是普通函数会丢失this指向，不会指向VueComponent：

### 可以在外部用变量存储this

### 改用箭头函数

```js
//uni中的api
//let _this = this;
uni.showModal({
	// success: function(res) {
	success: (res) => {
	//如果用普通函数，这里的this指向这个函数自身
	// console.log(this)
        if (res.confirm) {
            this.agree = true;
        }
	}
});
```



## 封装uni.request( )，在main.js文件中：

```js
//配置接口基础路径
Vue.prototype.$baseUrl = '/miniso';
//对uni.request()进行封装，解决请求回调地狱
Vue.prototype.$http = function(req) {
	if (!req.url) {
		throw new TypeError('url地址必传')
	}
	return new Promise(resolve => {
		uni.request({
			url: this.$baseUrl + req.url,
			method: req.method || 'GET',
			data: req.data || {},
			success( {data} ) {
				resolve(data )
			},
			fail(err) {
				resolve(err)
			}
		})
	})
}
```



## 实现免登录：

```js
		created() {
			let cache = uni.getStorageSync('user-login-info')
			if (!!cache) {
				//如果cache存在，判断openid是否存在，然后判断时间是否过期
				if (!cache.openid) {
					return
				}
				let time = Date.now() - cache.timestamp;
				//有效期7天
				if (time > 7 * 24 * 60 * 60 * 1000) {
					return
				}
				//已过期，就发出请求
				//调用登录方法
				this.login(cache.openid)
			}
		},
```



## uni中跳转页面区别：

```js
uni.navigateTo({url: '../home/home')  //不会覆盖前一个页面，顶部导航会出现一个返回键

uni.redirectTo({})	//会覆盖前一个，只有一个页面，没有返回键
```



## Vuex的使用：

*为什么要使用Vuex，它有什么好处？*

*Vuex是实现全局共享状态数据管理的一个库，并且它可以实现数据可预测化。*

*getters实现数据更新消息订阅，mutations实现数据更新消息发布，所以mutations里不能使用异步函数。*

### uni中集成了Vuex，可直接使用

### uni中的 this 上没有 $store，需要自己实现 $store 挂载

### vuex缓存的数据，页面刷新后，方法会重新执行，数据就会被初始化，所以需要实现持久化缓存

*什么时候缓存* ？

*mutations是 vuex 中唯一可以修改数据的地方，所以在这里缓存最新的数据*

*什么时候取数据* ？

*页面刷新以后，vuex 会进行初始化，所以在初始化时去取缓存数据*

```js
//引入导出的实例
import store from './store/index.js'
//在Vue的原型上挂载$store实例
Vue.prototype.$store = store;

//在Vue实例中注入store
const app = new Vue({
	//注入store实例
	store,
	...App
})
```

```js
//根目录下，store文件夹，index.js文件中
import Vue from 'vue'
//引入vuex插件
import Vuex from 'vuex'
//注册插件
Vue.use(Vuex)

//获取缓存的用户数据
let cache = uni.getStorageSync('vuex') || {}

//定义state数据
//页面初始化也是这里
let state = {
	//有缓存的数据就用缓存的，没有就初始化
	userInfo: cache.userInfo || {}
}

const store = new Vuex.Store({
    //模块化
	modules: {
        //定义模块
		common: {
            //开启命名空间
			namespaced: true,
            //注入state数据
			state,
            //getters中定义获取数据的方法
			getters: {
				userInfo: _state => _state.userInfo
			},
            //mutations中定义修改数据的方法
             mutations: {
				setUserInfo(_state, _userInfo) {
					_state.userInfo = _userInfo;
                    //这里的 _state数据是最新的，可以进行缓存
                    //不要使用localStorage、sessionStorage，小程序中没有
                    //使用uni.setStorageSync方法
					uni.setStorageSync('vuex', _state)
				}
			}
		}
	}
})
//导出实例
export default store
```



## Vue自定义事件：

父组件中：

```js
<子组件 @自定义事件名="回调方法"></子组件>

methods:{

	回调方法

}
```

子组件中：

触发传过来的自定义事件：	this.$emit( ' 自定义事件名 ' , 参数...)

*！！！事件名要加引号*



## uni中，created生命周期只会触发一次，进行初始化，使用tabBar切换页面不会多次触发created生命周期，应使用onShow生命周期。



## 懒加载：（提升网页请求效率，改善用户体验）

### 标识：

### this.loading（正在加载），默认为 true

### hasMore(是否还有更多)，默认为 true



### 在展示数据列表的区域后面条件渲染：

#### 正在加载、加载更多、已经到底了三种状态



### 请求完数据后，更新标识：

```js
//是否有更多数据
this.hasMore = this.page * this.size < total;

//如果是第一页，直接展示rows，如若请求了第二页，合并之前的数据
this.contentList = this.page === 1 ? rows : this.contentList.concat(rows)

//异步赋值，赋值和页面渲染是异步的
setTimeout(() => {
		this.loading = false;
})
```

```js
scroll-view组件，@scrolltolower = " scrollEvt "
//滚动事件，要节流
scrollEvt() {
    //如果没有更多数据
    if (!this.hasMore) {
        return;
    }
    //如果正在加载，也不能请求数据
    if (this.loading) {
        return;
    }
    console.log('请求更多')
    this.loading = true;
    this.page += 1;
    this.getContentList()
}
```



### 在需要的地方（如：大类切换，应从第一页请求），进行初始化数据



## uin中通过路由地址传递的查询参数：

### 可以在onLoad生命周期中获取

```js
uni.navigateTo({
    url: '../detail/show?id=' + item.id
})

//跳转的页面
onLoad(routeQuery) {
	//console.log(arguments)
    let id = routeQuery.id
}
```



# HBuilderX中发布项目：

```js
//只在开发时用
Vue.prototype.$baseUrl = '/miniso';

//项目发布时改成线上服务器地址，如果跨域了，让后端解决，我们的跨域配置只能用于前端开发
Vue.prototype.$baseUrl = 'http://www.shuiyue.info:15666';
```



- ### 原生APP - 云打包：发布混合APP

- ### 小程序发布

  - 需要在manifest.json => 微信小程序 配置 APPID