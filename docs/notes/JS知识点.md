# this指向

### 不管我们给函数 `bind` 几次，`fn` 中的 `this` 永远由第一次 `bind` 决定

`bind` 这些改变上下文的 API 了，对于这些函数来说，`this` 取决于第一个参数，如果第一个参数为空，那么就是 `window`

```js
let a = {}
let fn = function () { console.log(this) }
fn.bind().bind(a)() 
结果：window对象
```



### 改变this指向的规则：

#### 首先，`new` 的方式优先级最高，

#### 接下来是 `bind` 这些函数，

#### 然后是 `obj.foo()` 这种调用方式，

#### 最后是 `foo` 这种调用方式，

#### 同时，箭头函数的 `this` 一旦被绑定，就不会再被任何方式所改变。



# == 和 === 有什么区别？

== 如果对比双方的类型**不一样**的话，就会进行**类型转换**

===对比双方数据类型和值，不会转换类型

1. 首先会判断两者类型是否**相同**。相同的话就是比大小了
2. 类型不相同的话，那么就会进行类型转换
3. 会先判断是否在对比 `null` 和 `undefined`，是的话就会返回 `true`
4. 判断两者类型是否为string和number，是的话就会将字符串转换为number
5. 判断其中一方是否为boolean，是的话就会把 `boolean` 转为 `number` 再进行判断
6. 判断其中一方是否为 `object` 且另一方为 `string`、`number` 或者 `symbol`，是的话就会把 `object` 转为原始类型再进行判断。

##  [ ] == ![ ]   结果为true

## ![ ]  => false => 0  ( !是逻辑运算， 空数组[ ] 转换为 Boolean 值为真，取反为假 )

## [ ] => 0



# 闭包：

### 函数 A 内部有一个函数 B，函数 B 可以访问到函数 A 中的变量，那么函数 B 就是闭包。

```js
function A() {
  let a = 1
  window.B = function () {
      console.log(a)
  }
}
A()
B() // 1
```

### 闭包存在的意义就是让我们可以间接访问函数内部的变量。



# 深浅拷贝：

## 浅拷贝：

### 对象类型在赋值的过程中其实是复制了地址，从而会导致一方改变,另一方也会被改变的情况。通常在开发中我们不希望出现这样的问题，我们可以使用浅拷贝来解决这个情况。

#### Object.assign()实现，Object.assign只会拷贝所有的属性值到新的对象中，如果属性值是对象的话，拷贝的是地址，所以并不是深拷贝。

Object.assign用法：https://m.php.cn/article/462354.html

```js
let a = {
  age: 1
}
let b = Object.assign({}, a) //前者是目标对象，其后的是源对象，有相同键的属性，源对象会覆盖目标对象里的
//如果目标对象有变量接收，那么合并后，目标对象也会有其它属性
a.age = 2
console.log(b.age) // 1
```

#### 展开运算符 `...`实现

```js
let a = {
  age: 1
}
let b = { ...a }
a.age = 2
console.log(b.age) // 1
```

## 深拷贝：

### 浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，那么就又回到最开始的话题了，两者享有相同的地址。要解决这个问题，我们就得使用深拷贝了。

### JSON.parse(JSON.stringify(object))实现

```js
let a = {
  age: 1,
  jobs: {
    first: 'FE'
  }
}
let b = JSON.parse(JSON.stringify(a))
a.jobs.first = 'native'
console.log(b.jobs.first) // FE
```

### 局限性：

- #### 会忽略 `undefined`

- #### 会忽略 `symbol`

- #### 不能序列化函数

- #### 不能解决循环引用的对象

```js
let obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
}
obj.c = obj.b
obj.e = obj.a
obj.b.c = obj.c
obj.b.d = obj.b
obj.b.e = obj.b.c
let newObj = JSON.parse(JSON.stringify(obj))
console.log(newObj)
```

如果你有这么一个循环引用对象，不能通过该方法实现深拷贝

```js
let a = {
  age: undefined,
  sex: Symbol('male'),
  jobs: function() {},
  name: 'yck'
}
let b = JSON.parse(JSON.stringify(a))
console.log(b) // {name: "yck"}
```

上述情况中，该方法会忽略掉函数和 `undefined`、Symbol



```js
function deepClone(obj) {
  //判断是否为对象类型且不为null
  //typeof [1,2] 为 object
  function isObject(o) {
    return (typeof o === 'object' || typeof o === 'function') && o !== null
  }
  //不为对象抛错
  if (!isObject(obj)) {
    throw new Error('非对象')
  }

  //isArray判断是数组还是对象
  let isArray = Array.isArray(obj)
  let newObj = isArray ? [...obj] : { ...obj }
  Reflect.ownKeys(newObj).forEach(key => {
    newObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
  })

  return newObj
}

let obj = {
  a: [1, 2, 3],
  b: {
    c: 2,
    d: 3
  }
}
let newObj = deepClone(obj)
newObj.b.c = 1
console.log(obj.b.c) // 2
```

# ES6：

## 提升（ hoisting ）

### 虽然变量还没有被声明，但是我们却可以使用这个未被声明的变量，这种情况就叫做提升，并且提升的只是声明。仅限使用var关键字声明。使用 var 声明的变量会被提升到作用域的顶部。

```js
var a = 10
var a
console.log(a)

//以上代码等价于
var a
var a
a = 10
console.log(a) //10
```

### 函数也会被提升，并且优先于变量提升：

```js
console.log(a) // ƒ a() {}
function a() {}
var a = 1
```

```js
var a = 1
let b = 1
const c = 1
console.log(window.b) // undefined
console.log(window. c) // undefined

function test(){
  console.log(a)
  //let 造成暂时性死区，变量在编译的环节中被告知在这块作用域中可以访问，但是访问是受限制的。
  let a
}
test()
```

### 提升存在的根本原因就是为了解决函数间互相调用的情况：

```js
function test1() {
    test2()
}
function test2() {
    test1()
}
test1()
```



## var、let、const的区别：

- ### `var` 在全局作用域下声明变量会导致变量挂载在 `window` 上，其他两者不会

- ### `var` 存在提升，我们能在声明之前使用。`let`、`const` 因为暂时性死区的原因，不能在声明前使用

- ### `let` 和 `const` 都不能多次声明变量，作用基本一致。前者声明的变量可以多次赋值，后者声明的变量不能再次赋值



## 原型继承和 Class 继承：

### 其实在 JS 中并不存在类，`class` 只是语法糖，本质还是函数

```js
class Person {}
Person instanceof Function // true
```

### 组合继承

组合继承是最常用的继承方式，

```js
function Parent(value) {
  this.val = value
}
Parent.prototype.getValue = function() {
  console.log(this.val)
}
function Child(value) {
  Parent.call(this, value)
}
Child.prototype = new Parent()

const child = new Child(1)

child.getValue() // 1
child instanceof Parent // true
```

以上继承的方式核心是在子类的构造函数中通过 `Parent.call(this)` 继承父类的属性，然后改变子类的原型为 `new Parent()` 来继承父类的函数。

这种继承方式优点在于构造函数可以传参，不会与父类引用属性共享，可以复用父类的函数，但是也存在一个缺点就是在继承父类函数的时候调用了父类构造函数，导致子类的原型上多了不需要的父类属性，存在内存上的浪费。

<!-- ![image-20220924105652798](C:\Users\37734\AppData\Roaming\Typora\typora-user-images\image-20220924105652798.png) -->



## 寄生组合继承

这种继承方式对组合继承进行了优化，组合继承缺点在于继承父类函数时调用了构造函数，我们只需要优化掉这点就行了。

```js
function Parent(value) {
  this.val = value
}
Parent.prototype.getValue = function() {
  console.log(this.val)
}

function Child(value) {
  Parent.call(this, value)
}
Child.prototype = Object.create(Parent.prototype, {
  constructor: {
    value: Child,
    enumerable: false,
    writable: true,
    configurable: true
  }
})

const child = new Child(1)

child.getValue() // 1
child instanceof Parent // true
```

以上继承实现的核心就是将父类的原型赋值给了子类，并且将构造函数设置为子类，这样既解决了无用的父类属性问题，还能正确的找到子类的构造函数。

<!-- ![image-20220924105716221](C:\Users\37734\AppData\Roaming\Typora\typora-user-images\image-20220924105716221.png) -->

## Class 继承

以上两种继承方式都是通过原型去解决的，在 ES6 中，可以使用 `class` 去实现继承，并且实现起来很简单

```js
class Parent {
  constructor(value) {
    this.val = value
  }
  getValue() {
    console.log(this.val)
  }
}
class Child extends Parent {
  constructor(value) {
    super(value)
  }
}
let child = new Child(1)
child.getValue() // 1
child instanceof Parent // true
```

`class` 实现继承的核心在于使用 `extends` 表明继承自哪个父类，并且在子类构造函数中必须调用 `super`，因为这段代码可以看成 `Parent.call(this, value)`。



# 模块化：

### 使用模块化的好处：

- 解决命名冲突
- 提高复用性
- 提高代码可维护性

## 哪几种方式可以实现模块化：

### 立即执行函数

在早期，使用立即执行函数实现模块化是常见的手段，通过函数作用域解决了命名冲突、污染全局作用域的问题

```js
(function(globalVariable){
   globalVariable.test = function() {}
   // ... 声明各种变量、函数都不会污染全局作用域
})(globalVariable)
```

AMD  

CMD

CommonJS

ES Module





# 执行栈：

### 可以把执行栈认为是一个存储函数调用的**栈结构**，遵循先进后出的原则。

<!-- ![](C:\Users\37734\Desktop\interview\前端面试之道\1670d2d20ead32ec.gif) -->



## Event Loop 执行顺序：

### Event Loop 解释：

## https://blog.csdn.net/qq_42865575/article/details/124847530

### 微任务包括 `process.nextTick` ，`promise` ，`MutationObserver`。

​	**微任务，microtask，也叫 jobs**

​		会在执行栈为空时,一次行全部执行

### 宏任务包括 `script` ， `setTimeout` ，`setInterval` ，`setImmediate` ，`I/O` ，`UI rendering`。

​	**宏任务，macrotask，也叫 tasks。**

​		每一次事件循环只执行一个

这里很多人会有个误区，认为微任务快于宏任务，其实是错误的。因为宏任务中包括了 `script` ，浏览器会**先执行一个宏任务**，接下来有异步代码的话才会先执行微任务。

--------------------------------------------------------------------------------------------------------

### 对比下面的步骤

- 首先执行同步代码，这属于宏任务
- 当执行完所有同步代码后，执行栈为空，查询是否有异步代码需要执行
- 执行所有微任务
- 当执行完所有微任务后，如有必要会渲染页面
- 然后开始下一轮 Event Loop，执行宏任务中的异步代码，也就是 `setTimeout` 中的回调函数

---------------

### 步骤：（更好的说明版本）

1. 把引入的 js 脚本当做宏任务执行

2. 解析执行过程中遇到微任务 Promise, 就放到微任务队列

3. 遇到宏任务就放宏任务队列，比如 setTimeout, setInterval 之类的

4. 同步任务执行完了，执行栈为空，就来执行微任务，清空整个微任务队列

5. 微任务执行完了，就在宏任务里面取一个宏任务，执行

6. 更新视图



### 执行顺序对比：

<!-- <img src="C:\Users\37734\Desktop\interview\event_loop.jpg" style="zoom:150%;" /> -->

