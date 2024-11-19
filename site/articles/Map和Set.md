---
createTime: 2023-03-03
tags:
  - javascript
cover: /Exile_1_Words.png
---

## Map和Set

Map和Set是解决JS中数组和对象无法应对<u>某些情况</u>而存在的数据结构。

### Map：映射，带键的集合，与Object最大的区别是Map允许任何类型的键，而Object支持字符串类型的键

```js
let map = new Map();	//创建一个map
//传入可迭代对象初始化map
let map2 = new Map([
    [1,'1'],
    ['2',2]
])
//根据对象创建map
let obj = {
    name: 'zs',
    age = 25
}
//Object.entries(object)将一个对象obj 转化为键值对数组 => [[1,'1'],['2',2]]
let map3 = new Map(Object.entries(obj))

//Object.fromEntries(可迭代对象)将一个键值对数组[[key1,val1],[key2,val2]]转化为普通对象
let obj2 = Object.fromEntries([
    ['male',1],
    ['female',2]
])
//obj2 = { male:1, female:2 }

/* 
* Methods & Attrs:
* map.size 返回存储的个数
* map.set(key: any,val)	存储值		返回map本身，可以链式调用
* map.get(key) 根据键获取值，如果键不存在返回undefined
* map.has(key) 判断是否存在某个键，存在返回true,否则false
* map.delete(key) 删除对应键的值	删除成功返回true，删除不存在的返回false
* map.clear() 清空整个map
*
* 遍历:
* map.keys()	遍历map并返回一个包含所有键的可迭代对象
				将其转换为数组Array.from(map.keys())
* map.values()	...值
* map.entries() 遍历map并返回一个包含所有实体的可迭代对象
*/
map.forEach((val,key,map) => {})
```



### Set：值的集合，没有键，它的每个值只能出现一次。

```js
let set = new Set(可迭代对象，通常是数组)

/*
* Methods & Attrs:
* set.size	返回存储的个数
* set.add(val) 添加一个值	返回set本身	 添加同一个值不起作用
* set.delete(val) 删除一个值		如果值存在返回true，否则false
* set.has(val) 判断一个值是否存在，存在返回true，否则false
* set.clear() 清空整个set
*
* 遍历：
* set.keys()	遍历并返回一个包含所有值的可迭代对象
* set.values()	...同上
* set.entries()	遍历并返回一个包含所有实体[val,val]的可迭代对象
*/
set.forEach((val, valAgain, set) => {})
```



## WeakMap:	弱映射

```js
//该对象存储在内存中，被user引用
let user = { name: '张三' };

//将user的引用置空，由于垃圾回收机制，对象会被从内存中清除
user = null;


//如果把一个对象放在数组中，只要这个数组存在，那该对象也存在
let user = { name: '张三' };
let arr = [ user ];
//虽然user引用被置空，但已经被存储在了数组中，对象不会被回收
user = null;


//Map同样
let user = { name: '张三' };
let map = new Map();
map.set(user,'val');
//对象不会被回收
user = null;
```

与Map的区别：

1. WeakMap 的键必须是对象，不可以是原始值。
2. 用 WeakMap 以对象作为键，如果没有其他对该对象的引用，该对象会被从内存中( weakmap )删除。对象被删除后，其值也会被清除。

```js
let user = { name: '张三' };
let weakMap = new WeakMap();
weakMap.set(user,'val');
//对象被删除了
user = null;
```

​	3.不支持迭代、keys()、values()、entries()方法。

​	WeakMap 支持以下方法：

- `weakMap.get(key)`
- `weakMap.set(key, value)`
- `weakMap.delete(key)`
- `weakMap.has(key)`



## WeakSet:	弱集合

不可迭代。

与 set 类似，但只能添加对象，不能是原始值。

如果对象不能被访问，就会被清除。

支持 add()、has()、delete()方法，

不支持 size、keys()。



### WeakMap 和 WeakSet 优点都是对于对象的弱引用，易于被垃圾回收处理。



