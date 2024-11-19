---
createTime: 2023-03-15
tags:
  - javaScript
cover: /Taylor.jpg
---

# ES6+ 新增的一些语法特性：

## var、let  和 const 声明变量

```javascript
//var可以重复声明一个变量		let和const不可以
//var存在变量提升，可以先使用，后声明	let和const必须先声明再使用，否则会报错
//在全局作用域中，使用var声明的变量会出现在全局对象window上		let和const不会
```

## 解构赋值

```javascript
//数组解构
let arr = ['张三', 38, '男'];
let [ name, age, gender ] = arr;	
//逗号会忽略对应位置的元素
let [ name, , gender ] = arr;

//交换两个变量
let num1 = 0;
let num2 = 1;
[num1, num2] = [num2, num1];


//对象解构	
//只取所需要的数据
//从后端接口返回的数据结构 const result = { code: 0, data: {...}, msg: '...'  }
//在使用data数据时都需要 result.data. 拿数据	对懒人来说很不友好
const { data } = result;

//如果觉得data代表的意义不明确，可以在解构时另取名字
const { data: xxxData } = result;

//嵌套解构
const options = {
    point: {
        x: 0,
        y: 0
    },
    items: ['line','pie']
}

let {
    point: {
	    x,
    	y
    },
    items: [ type1, type2 ]
}
```

## 箭头函数

```javascript
function func () { ... }

const func = () => { ... }
//如果只有一个形参，括号可省略
const show = val => { alert(val); }

//如果函数语句体只有一句，可省略花括号	如果函数有返回值可省略 return
const show = val => alert(val)
```

## 函数形参默认值

```javascript
//ES6之前：
function func (arg) {
    arg = arg || 'default';
    ...
}
//ES6：
function func2 (arg = 'default') { ... }
```

```javascript
//默认值、解构结合
function func ( { name = '张三', age = 38, gender = '男' } ) { ... }

let obj = { name: '李四', age: 40 }
func(obj)
```

## 扩展运算符

```javascript
//合并数组
let arr1 = [1,2,3];
let arr2 = [4,5,6];
let newArr = [...arr1,...arr2];

//合并对象	浅拷贝
let obj = { name: '张三', age: 38, hobby: ['羽毛球','音乐','看电影'] };
let newObj = { ...obj, sex: '男' };
//同	let newObj = Object.assign( {}, obj );
```

## 可选链操作符

```javascript
let charts = {
	size: {
        width: 100,
        height: 100
    }
}

console.log( charts.size.width )
//对于深层次的对象，如果直接获取某个深度为二层及以上的属性，可能会报错

// let width = charts && charts.size && charts.size.width;	过于冗长

let width = charts?.size?.width;
```

## 空值合并运算符

```javascript
let width = 0;
console.log( width || 100 );	//	100
console.log( width ?? 100 );	//	0

//输入非空判断
if( val !== null && val !== undefined && val !== '' ) { ... };
                                                       
//如果 val 不为 undefined 和 null,就取val本身,同时不为空字符串,就能进入 if 语句体                           
//如果 val 为 undefined 或 null 就取空字符串，不能进入 if 语句体
if( (val ?? '') !== '' ) { ... }
```

## async 和 await

在一个函数前加上 async 关键字，通常会返回一个promise对象，返回一个普通值也会通过 Promise.then 被包装成Promise对象

```javascript
async function func1 () {
	return 'test async1';
}
let result = func1();
console.log(result);
//Promise{ [[PromiseState]]: "fulfilled", [[PromiseResult]]: "test async" }
```

如果没有返回值

```javascript
async function func2 () {
	console.log('test async2')
}
let result = func2();
console.log(func2);
//Promise{ [[PromiseState]]: "fulfilled", [[PromiseResult]]: undefined }
```

## await：

await 意为 等待，其后等待的是一个表达式，该表达式的返回值可以是 promise 对象也可以是其他值。

## await 的执行流程：

await 是一个让出线程的标志，其后的函数会先执行一遍，然后就会跳出整个 async 函数去执行后面的 JS 代码，等本轮的事件循环执行完之后又跳回到 async 函数中等待 await 后表达式的返回值，如果返回值为 非promise 对象则继续执行 async 函数后面的代码，否则将返回的 promise 放入 promise 队列。

```javascript
function testSomething() {
    console.log("执行testSometing");
    return "testSomething";
}
async function testAsync() {
    console.log("执行testAsync");
    return Promise.resolve("hello async");
}
async function test() {
    console.log("test start...");
    const v1 = await testSomething(); //关键点1
    console.log(v1);
    const v2 = await testAsync();
    console.log(v2);
    console.log(v1, v2);
}
test();
let promise = new Promise((resolve) => { 
    console.log("promise start..."); 
    resolve("promise");
}); //关键点2
promise.then((val)=> console.log(val));
console.log("test end...")
//	test start...		
//	执行testSomething
//	promise start...
//	test end...
//	testSomething
//	执行testAsync
//	promise
//	hello async
//	testSomething hello async

1.首先执行 test 函数打印 'test start...'
2.然后执行 testSomething 函数打印 '执行testSometing'
3.跳出 test 函数执行 new Promise 构造函数 打印 'promise start...'
4.因为 promise.then 是异步的，该任务进入 promise 队列
5.执行同步代码 console.log 打印 'test end...'
6.本轮事件循环结束 跳回 test 函数，由于 testSomething 函数返回的是 非promise ，继续执行后面的代码
	打印 v1 的值 'testSomething'
7.然后执行 testAsync 函数打印 '执行testAsync'
8.又跳出 test 函数，此时事件循环到了 promise 队列，执行 promise.then 打印 'promise'
9.跳回 test 函数，由于 testAsync 函数返回的是 promise ，进入 promise 队列，目前没有其他可执行代码，
	继续执行其后代码 打印 v2 的值 'hello async'	打印 v1 v2 'testSomething hello async'
```

欢迎补充~😀
