---
createTime: 2024-04-30
tags:
  - canvas
cover: /silence moment.jpg
---

[详细教程见 MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Basic_usage)

### 使用 canvas 绘制

想象一下我们是怎么画画的？

1.首先需要一张画布，作为最基本的一个载体展示我们要表达的内容。

`canvas` 元素就是我们的画布

```html
<canvas id='my-canvas'></canvas>
```

2.然后需要一支画笔，将我们的意识具象化。

`canvas` dom对象的 `getContext` 方法能够得到一个多功能背包，它里面有一支画笔。

```javascript
const canvas = document.getElementById('my-canvas');

const ctx = canvas.getContext('2d');
```

3.有了画笔没有颜料也不行。

```javascript
ctx.fillStyle = '#000000';
```

4.最后动笔画出目标。

```javascript
ctx.fillRect(x, y, width, height);
```

`canvas` 画布的默认尺寸是 300px * 150px, 超出画布的内容会被裁切。