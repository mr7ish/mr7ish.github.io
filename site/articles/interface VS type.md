---
createTime: 2023-05-26
tags:
  - TypeScript
coverImg: /the distance.jpg
---

## interface 和 type：

它们两个在普遍情况下作用相同，并且可以混用，但使用 interface 给出的错误提示更直接明了。

类型通过 & 符实现扩展（继承），接口通过 extends 关键字实现（接口可以继承类型，反之亦然）。

```typescript
type PartialPointY = { y: number; };
interface Ponit extends PartialPointY { x: number; };

interface PartialPointX = { x: number; };
type Point = PartialPointX & { y: number; };
```

它们之间的一个主要区别是：interface 是开放的，而 type 是封闭的。interface 可以通过二次声明来扩展自身，而 type 不可以。

```typescript
interface Point { x: number; };
interface Point { y: number; };
//	same as interface Point { x: number; y: number; };

type Point { x: number; };
type Point { y: number; };
//	error	
```

interface 描述一个对象和函数：

```typescript
interface Point {
	x: number;
	y: number;
}

interface SetPoint {
	(x: number, y: number) : void;
}
```

type 描述一个对象和函数：

```typescript
type Point {
	x: number;
	y: number;
}

type SetPoint = (x: number, y: number) => void;
```

type 可以用来 声明原始、联合、元组类型，接口不可以。

```typescript
//	primitive
type Name = string;
type PointX = { x: number };
type PointY = { y: number };
//	union
type PartialPoint = PointX | PointY;
//	tuple
type MyTuple = [number, string];
```

type 实现对象方法重载：（interface 不可以）

```typescript
//	对象里有一个log方法
interface NumLogger {
    log: (val: number) => void;
}
type StrAndNumLogger = NumLogger & {
    log: (val: string) => void;
} 
const logger: StrAndNumLogger = {
    log: (val: string | number) => console.log(val)
}
logger.log('hi~');
logger.log(666);
```

