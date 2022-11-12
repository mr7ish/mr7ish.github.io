# App项目流程

## 1.	index.html页面添加不允许用户缩放

```html
<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
```

## 2.	在main.js项目入口文件中（负责挂载虚拟DOM和实现业务注册等）

### 导入导出的路由实例，实现路由注入

```js
import router from './router'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

## 3.	在router/index.js中配置路由

```javascript
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//定义路由模式，路由对象
// @表示从src目录开始
//组件Login、Home
import Login from '@/pages/login'
import Home from '@/pages/home'

//实例化路由
const router = new Router({
	//指定路由模式
	mode: 'history',
	//配置路由
	//使用meta配置是否有权限进入页面————isAuth表示有权限  
	routes: [{
		path: '/',
		redirect: '/login'
	}, {
		path: '/login', component: Login, meta: { isAuth: true }
	}, {
		path: '/home', component: Home
	}]
})

export default router
```

## 4.	在App.vue项目页面入口文件中实现路由组件挂载、渲染

```vue
<template>
  <div>
    <router-view></router-view>
  </div>
</template>
```

## 5.	在router/index.js中配置全局路由访问权限拦截

```js
//全局路由访问权限拦截
router.beforeEach((to, from, next) => {
	//判断是否需要进行拦截
	if (to.meta.isAuth) {
		next()
		return;
	}
	//需要鉴权
	//获取加密的token
	// let token = 'token';
	let token = undefined
	//如果没有token
	if (!token) {
		next('/login')
		return;
	}
	//存的时候token &_& Date.now()
	//解密token，检验时效性   Date.now()减去token的时间戳 /1000/60/30  存30分钟，<1才有效    
	next()
})
```

## 6.	配置状态管理

## 7.	二次封装axios

## 