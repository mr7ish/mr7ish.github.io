---
createTime: 2023-06-16
tags:
  - javascript
---

## Object（对象）相关知识：

for of 不能遍历对象，这其实是片面的（可迭代对象都能遍历）

数组、字符串都是可迭代的

Object.keys(obj)	返回一个包含目标对象所有键的数组

Object.values(obj) 返回一个包含目标对象所有值的数组

Object.entries(obj)	返回一个包含目标对象所有键值对 [ key, value ]的数组

### 转换对象：

`Object.entries(obj)` 从 `obj` 获取由键值对组成的数组

`Object.fromEntries(array)`将数组转换成对象

```javascript
const fruits = {
    banana: 1,
    peach: 2,
    apple: 3
}

//[['banana', 1], ['peach', 2], ['apple', 3]]
const doubleFruits = Object.fromEntries(
	Object.entries(fruits).map( fruit => [fruit[0], fruit[1] * 2] )
)
```



### 属性属性描述符：

一个属性除了值 value 外还有，

writable	值为 true，则该属性的值可以被修改，否则该属性只读

enumerable	值为 true，则该属性会在遍历中被列出，否则不可列出

configurable	值为 true，则该属性可以被删除，这些特性可以被修改，否则不可以

```javascript
//	用常用的方式创建对象时，它们都为 true
const user = {
	name: 'zs',
    age: 18
}
```

Object.getOwnPropertyDescriptor( obj,  propName )	返回一个目标对象该属性所有信息的对象

Object.defineProperty( obj, propName, descriptor )	可以修改一个对象的属性描述符

如果该属性已存在，会更新其标志，否则会创建一个新的属性，这时如果没有提供标志，会默认为 false

```javascript
const user = {};
Object.defineProperty(user, 'name', {
    value: 'zs'
})
const desc = Object.getOwnPropertyDescriptor(user, 'name');
```

只读：

```javascript
//以字面量形式创建对象
const user = {
    name: 'zs'
}
Object.defineProperty(user, 'name', {
    writable: false
})
user.name = 'ls';	//不能修改
```

新创建的属性，要明确指出哪些标志是 true

可枚举性：

```javascript
const fruits = {
    banana: 3,
    peach: 8,
    apple: 5 
}
Object.definePropertyDescriptor(fruits, 'peach', {
	enumerable: false
})

for(const key in fruits) {
    console.log(key);
}

//	不可枚举的属性同样会被 Object.keys 排除
```

可配置性：防止删除属性和更改属性标志

```javascript
const desc = Object.getOwnPropertyDescriptor(Math, 'PI');
console.log(desc);
/*
{
  "value": 3.141592653589793,
  "writable": false,
  "enumerable": false,
  "configurable": false
}
*/
Math.PI = 3.14;	//不能修改
Object.defineProperty(Math, 'PI', {
    writable: true
})	//不起作用，因为 configurable 为 false
delete Math.PI;	//不能删除

//	configurable 为 false 时，唯一可行的操作
//将 writable: true 改为 fasle	防止值被更改
```

Object.defineProperties( obj, {

​	propName1: { },

​	propName2: { },

​	...

})

一次定义多个属性



### 访问器属性的 getter 和 setter：

数据属性

```javascript
//	读取属性时 getter 起作用， 修改属性时 setter 起作用
const user = {
    firstName: 'Jhon',
    lastName: 'Smith',
    //	基于已有属性添加新属性	看起来像一个函数，其实就是一个正常属性
    get fullName() {
		return `${this.firstName} ${this.lastName}`;
    }
    //	其实是在更改已有属性
    set fullName(val) {
        [this.firstName, this.lastName] = val.split(' ');
    }
}
user.fullName = 'LI MING';

```

### 访问器属性描述符：

访问器属性的描述符没有 value 和 writable，

get	不带参数的函数，属性被访问时调用

set	带有一个参数的函数，属性被设置时调用

enumerable	同数据属性

configurable	同数据属性

```javascript
const user = {
    firstName: 'Jhon',
    lastName: 'Smith'
}

Object.defineProperty(user, 'fullName' , {
    get() {
		return `${this.firstName} ${this.lastName}`;
    }
    set(val) {
		[this.firstName, this.lastName] = val.split(' ');
	}
})
```

一个属性只能是数据属性和访问器属性其中之一，即不能 value 和 get/set 同时出现



```javascript
const user = {
    get name() {
		return this._name;
    }
    set name(val) {
        if(val.length < 3) {
            alert('name太短了');
            return;
        }
        this._name = val;
    }
}

user.name = 'zs';

user.name = 'Messi';

// 外部可以直接访问 user._name, 但有一个约定,以下划线开头的属性是内部属性,不应该从外部直接访问。


```



