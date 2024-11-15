---
createTime: 2024-11-14
tags:
  - css
  - interview
cover: /三叶.png
---


- ### 标准盒模型和怪异盒模型
是 CSS 中定义盒子元素尺寸计算方式的两种模型

in a word: 标准盒模型的宽高只包含内容区域，而怪异盒模型的宽高包含内容、内边距和边框。

@example:

标准盒模型：

一个元素的 width 设置为 100px，且有 10px 的内边距和 10px 的边框，则其 <u>总宽度</u> 为 100 + 10 + 10 + 10 + 10 = 140px。

怪异盒模型：

一个元素的 width 设置为 100px，且有 10px 的内边距和 10px 的边框，则其 <u>内容宽度</u> 为 100 - 10 - 10 - 10 - 10 = 60px。

- ### 重流和重绘

in a word: 重流是指 <u>页面的结构发生变化时</u> 浏览器重新计算元素的位置和尺寸，会导致重新计算整个页面布局，重绘是指 <u>元素的外观变化时</u> 浏览器重新绘制元素，重流性能开销较大，重绘性能开销相对较小。

- ### CSS实现单行、多行文本溢出隐藏

```css
.single-line {
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden;    /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 使用省略号表示溢出的文本 */
}

/* 适用于支持 WebKit 引擎的浏览器（如 Chrome 和 Safari） */
.multi-line-webkit {
  display: -webkit-box; /* 使用弹性盒模型 */
  -webkit-box-orient: vertical; /* 垂直排列 */
  -webkit-line-clamp: 3; /* 限制显示的行数 */
  overflow: hidden; /* 隐藏超出的内容 */
}

/* 适用于大多数浏览器 */
.multi-line-most {
  display: block;
  max-height: 4.5em; /* 根据 line-height 计算最大高度，4.5em 是 3 行文本 */
  line-height: 1.5em; /* 设置行高 */
  overflow: hidden;
}
```

#### 扩展：使用 js 实现更高兼容的方式
```html
<div class="multi-line" id="text-container">
  这是一个很长的文本，可能会超出容器的边界，溢出部分应该隐藏。
</div>

<script>
  function clampText(container: HTMLElement, lines: number) {
    const lineHeight = parseInt(window.getComputedStyle(container).lineHeight);
    const maxHeight = lineHeight * lines;
    container.style.maxHeight = `${maxHeight}px`;
    container.style.overflow = 'hidden';
  }

  const container = document.getElementById('text-container');
  clampText(container, 3); // 设置最多显示 3 行
</script>
```