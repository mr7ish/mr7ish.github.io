React用脚手架创建项目用	npx  create-react-app  项目名

npm是本地命令，npx是nodejs集成的远程命令

React运行和构建最好用	yarn 而不是 npm

安装 yarn ： npm i -g yarn

安装依赖	yarn 或 yarn install

( 不需要 run )

运行	yarn start

构建	yarn build

安装第三方库	yarn add echarts@4



### React使用基本规则：

项目中每个组件都必须引入react库		import React from 'react'

每一个项目入口必须引入挂载组件到真实DOM Tree上的渲染方法		import ReactDom from 'react-dom' 

ReactDom.render(

​	元素,

​	容器

)



函数组件

```js
//React中没有指令，只有 { } 这一种语法，用{ }来绑定
//style必须是一个对象
//函数组件中没有this,所以也叫无状态组件
function Node() {
	return (
		<h1 style={ style }> Hello React </h1>
        { /* React的 jsx注释要使用'{}'包裹 */ }
	)
}
//在React中引用组件必须首字母大写
ReactDom.render(
	<Node />,

	

)
```





