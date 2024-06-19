---
createTime: 2023-03-03
tags:
  - utils
cover: /song of lives .png
---

介绍两种比较简单的打印方法：

## 一、直接调用 window.print()

浏览器自带打印功能，不能指定打印容器，打印时默认只会选择当前最顶层的窗口，并且第三方组件的样式不会生效。

可以在打印时将 body 替换为要打印的区域，打印完后再换回去，有点复杂。

## 二、vue插件：vue-print-nb

本质上也是使用浏览器自带的打印 `window.print()`来实现的，默认会创建一个 iframe，将要打印的内容嵌入进去。

可以指定打印的容器，如果要更多功能可以传对象。第三方组件的样式支持不好。

### 使用：

vue2：npm install vue-print-nb --save

<u>vue3版本安装：npm install vue3-print-nb --save</u>

注册全局指令：

```js
//main.ts文件
import { createApp } from 'vue';
import App from './App.vue';
import print from 'vue3-print-nb';
const app = createApp(App);
app.use(print);
app.mount('#app');
```

局部注册：

```vue
<script setup lang='ts'>
    import print from 'vue3-print-nb';
    //自定义指令
    const vPrint = print;
</script>

<!-->在模板中使用<-->
<template>
	<!-->指定打印区域的id<-->
	<button v-print="'#printContainer'">打印pdf</button>
	<div id="printContainer">
    	要打印的内容区域...
    </div>
</template>
```

更多配置：

```vue
<script setup lang='ts'>
    import print from 'vue3-print-nb';
    const vPrint = print;
    
    const printOptions = reactive({
        id: 'printContainer',	//打印容器id
        popTitle: '',	//顶部页眉的标题
        standard: 'html5'	//打印的文档类型，默认为html
        //打开打印页面前的回调
        beforeOpenCallback (vue: any) {
        	vue.printLoading = true
        	console.log('打开之前')
        },
        //打开打印页面时的回调
        openCallback (vue: any) {
        	vue.printLoading = false
        	console.log('执行了打印')
       	},
        //关闭打印页面后的回调
        closeCallback (vue: any) {
        	console.log('关闭了打印工具')
        }
    })
</script>

<template>
	<button v-print="printOptions">打印pdf</button>
	<div id="printContainer">
    	要打印的内容区域...
    </div>
</template>
```



打印PDF的插件几乎都有一些问题，需要自己调整样式：

可以通过在打印时改变一些样式<u>尽量</u>达到预期效果。

```html
<style>
/*打印时才生效的样式*/
@media print {
    /*隐藏页眉页脚*/
	@page {
      size: auto;
      margin: 3mm;
    }
    /*隐藏按钮，打印时不包含按钮*/
    .print-hide {
		display: none !import;
    }
    /*在有类名的元素前插入分页符（强制分页）*/
    .print-break-before {
		page-break-before: always;
    }
    /*在有类名的元素后插入分页符（强制分页）*/
    .print-break-after {
		page-break-after: always;
    }
   	/*
    	其他操作...
    */
}
</style>
<body>
    <div>打印的内容...<button class="print-hide">导出</button></div>
</body>
```



表格多页断页情况：

不妨把截断的内容另外当成一个整体调整样式再打印。

第二页上边距如果太近，可以在最前面加一个空div盒子，加上在打印时才生效的高度样式来调整。



## Other:	html2canvas + jspdf

原理：通过 `html2canvas` 将 `HTML` 页面转换成`canvas`图片，再通过 `jspdf` 将图片转成 `pdf`格式文件。

缺点：

1. 清晰度不够
2. 分页时，内容会被截断，不能智能展示完整
3. 页面内容太长时（宽高限制为 14400），无法打印出内容

使用说明 ：https://juejin.cn/post/7090368199291568165#heading-4 





还有其他方法，欢迎补充 ~😃