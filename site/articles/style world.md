---
createTime: 2023-08-25
tags:
  - css
cover: /star trails.png
---

滚动条自定义：

Google

```css
整体部分 ::-webkit-scrollbar
两端按钮 ::-webkit-scrollbar-button
外层轨道 ::-webkit-scrollbar-track
内层轨道 ::-webkit-scrollbar-track-piece
滚动滑块 ::-webkit-scrollbar-thumb
边角 ::-webkit-scrollbar-corner

::-webkit-scrollbar { /* 血槽宽度 */
 width: 8px; height: 8px; 
} 
::-webkit-scrollbar-thumb { /* 拖动条 */ 
 background-color: rgba(0,0,0,.3); 
 border-radius: 6px; 
} 
::-webkit-scrollbar-track { /* 背景槽 */ 
 background-color: #ddd; 
 border-radius: 6px; 
} 
```



移动端尺寸适配：

代码可微调也可直接使用，screen and可以删除，1000px之后的尺寸可以使用固定值等

```css
html {
 font-size: 16px;
}
@media screen and (min-width: 375px) {
 html {
 /* 375px作为16px基准，414px宽度时正好对应18px的根字号大小 */
 font-size: calc(16px + 2 * (100vw - 375px) / 39);
 }
}
@media screen and (min-width: 414px) {
 html {
 /* 屏幕宽度从414px到1000px，根字号大小累积增加4px（18px-22px）
*/
 font-size: calc(18px + 4 * (100vw - 414px) / 586);
 }
}
@media screen and (min-width: 1000px) {
 html {
 /* 屏幕宽度从1000px往后每增加100px，根字号大小就增加0.5px */
 font-size: calc(22px + 5 * (100vw - 1000px) / 1000);
 }
}
```



文本域禁止拖动：

```css
textarea {
	resize: none;
}
```



改变输入框光标颜色：

```css
input {
	color: #333;
	caret-color: red;
}
```

