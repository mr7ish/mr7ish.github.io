---
createTime: 2024-12-04
tags:
  - vue
  - interview
cover: /Arcane-Jinx.png
---

### vue 的响应式原理

Vue 的响应式系统基于 数据代理 和 观察者模式，核心思想是：当数据变化时，视图会自动更新。Vue 通过劫持对象的属性并监听属性的变化，来实现响应式数据绑定。

#### Vue 的响应式系统由以下几个核心部分组成：

- 数据劫持（Data Hijacking）：Vue 通过 Object.defineProperty() 或 Proxy API，劫持对象的属性，在数据变化时能够捕获变化并通知视图更新。

- 依赖收集（Dependency Collection）：当组件渲染时，Vue 会记录每个依赖于数据的视图部分（即每个依赖于数据的计算属性或模板），当数据变化时，Vue 知道哪些部分需要更新。

- 观察者模式（Observer Pattern）：Vue 通过 Observer 模式将数据与视图绑定，确保数据变化时自动更新视图。

Vue 2.x 的响应式系统使用 Object.defineProperty() 来劫持对象的属性和监听数据变化。

Vue 3.x 对响应式的实现进行了优化，使用了 Proxy API 替代了 Object.defineProperty()，实现了更灵活、更高效的响应式系统。

### vue3 和 vue2 的区别

- Composition API (组合式 API)

Vue 3 引入了 Composition API，包括 ref、reactive、computed 等函数，用于代替 Vue 2 中的 Options API（data、methods、computed 等）。
组合式 API 更加灵活，适用于大型应用和复杂的业务逻辑，允许代码更易于组织和复用。

- 性能提升

1. Vue 3 在底层进行了许多优化，增强了性能。比如，虚拟 DOM 和响应式系统都进行了优化。
2. 编译优化：Vue 3 的编译器能够生成更加高效的代码，减少了内存和 CPU 的消耗。
3. Tree Shaking：Vue 3 的代码更容易进行 Tree Shaking（去除无用代码），减小了包体积。

- 响应式系统改进

vue3支持数组索引和对象属性的动态添加、删除

- Fragment（片段）

允许组件返回多个根节点。Vue 2 要求每个组件只有一个根节点。

### 通用问题
#### 基础概念
1. Vue 的核心特性是什么？
::: details
- 响应式数据绑定：基于数据驱动视图更新，通过 getter 和 setter 实现数据与 DOM 的绑定。
- 组件化开发：将界面抽象为独立的组件，提高复用性和维护性。
- 指令系统：提供内置指令（如 v-if、v-for、v-bind）以及自定义指令。
- 事件处理：通过事件绑定 (@ 或 v-on) 实现与用户交互。
- 灵活的模板语法：支持 HTML 模板和 JSX。
- 丰富的生态：包括 Vue Router（路由）、Vuex（状态管理）和 Vite/Vue CLI（构建工具）。
:::

2. Vue 的双向绑定原理是如何实现的？
::: details
Vue 2：
- 使用 Object.defineProperty 拦截对象属性的 get 和 set。
- 在属性被访问时，收集依赖（订阅者）。
- 在属性更新时，通知依赖（发布者）更新视图。
Vue 3：
- 通过 Proxy 实现响应式，能够拦截对象的所有操作（如动态添加属性）。
- 配合 effect 收集依赖和更新视图。
:::

3. 如何使用 v-model 实现表单绑定？支持哪些表单元素？
::: details
绑定方法：

```vue 
<input v-model="value" />：绑定输入框。
<textarea v-model="value" />：绑定文本区域。
<select v-model="selected" />：绑定下拉框。
<input type="checkbox" v-model="checked" />：绑定复选框（单个或数组）。
<input type="radio" v-model="picked" />：绑定单选框。
```
工作原理：

v-model 实际上是 `:value` 和 `@input` 的语法糖：
```vue
<input :value="value" @input="value = $event.target.value" />
```
:::

4. Vue 的生命周期钩子有哪些？每个钩子函数的作用是什么？
::: details
Vue 2 和 Vue 3 通用钩子：

- beforeCreate
实例初始化之前调用，data 和 methods 尚未初始化，不能访问 this 的属性。
- created
实例创建完成，已初始化 data 和 methods，但还未挂载到 DOM。
- beforeMount
在挂载开始前调用，此时模板已编译，但尚未渲染到页面。
- mounted
实例挂载完成，DOM 已生成，适合进行 DOM 操作。
- beforeUpdate
响应式数据更新之前调用，可在此访问到更新前的 DOM。
- updated
响应式数据更新并重新渲染 DOM 后调用。
- beforeDestroy / beforeUnmount（Vue 3）
实例销毁前调用，可用于清理计时器或解绑事件。
- destroyed / unmounted（Vue 3）
实例销毁后调用，所有事件监听器和子实例已移除。

Vue 3 新增钩子：

- onRenderTracked 和 onRenderTriggered
调试响应式渲染的依赖追踪。
- onErrorCaptured
捕获子组件的错误，类似全局的错误处理。
:::

5. 父子组件如何通信？还有哪些其他组件通信方式？
::: details
父子组件通信：

- Props
父组件通过 props 向子组件传递数据。
- $emit
子组件通过 $emit 向父组件发送事件。
其他组件通信方式：

- Provide/Inject（Vue 2.2+ 和 Vue 3）
父组件通过 provide 提供数据，子组件通过 inject 接收，适合跨多层组件传递数据。
- Vuex
全局状态管理，适合复杂的多组件共享数据场景。
- Event Bus（Vue 2）
借助空的 Vue 实例作为事件总线，用于非父子组件通信。
- refs
父组件通过 ref 直接访问子组件实例或 DOM 节点。
全局状态（Vue 3 Composition API）
使用 reactive 或 ref 创建响应式数据，在多个组件间共享。
:::

6. Vue 的 computed 和 watch 有什么区别？它们的适用场景是什么？
::: details
- computed

基于依赖缓存，只有相关依赖改变时才会重新计算。
适合计算属性，如复杂的数据处理或派生状态。

- watch

用于监听特定数据的变化，执行副作用（如 API 请求）。
适合异步操作或需要监控的场景。
:::

7. 如何实现一个自定义指令？
::: details
- 定义方式：

局部指令：在组件内定义。
全局指令：通过 Vue.directive 注册。
:::

8. 如何优化 Vue 应用的性能？
::: details
- 代码优化：

使用懒加载和动态导入。

拆分组件，避免单组件过大。

合理使用 computed 和 watch，减少多余的重新渲染。

- 模板优化：

使用 key 处理列表渲染。

避免 v-if 和 v-for 同时使用。

- 图片和静态资源优化：

压缩图片。

使用 CDN 加速静态资源加载。

- 响应式优化：

避免深层次的嵌套对象。

使用 shallowReactive 或 shallowRef 限制响应式范围。

- 开发工具：

使用 Vue Devtools 分析性能瓶颈。

使用 Webpack 或 Vite 打包优化。
:::

#### 原理与实现
1. Vue 中虚拟 DOM 是什么？为什么需要它？
2. Vue 的模板是如何被编译成渲染函数的？
3. Vue 的响应式系统是如何工作的？Vue2 和 Vue3 有何区别？
4. 事件机制：Vue 中的事件绑定与原生 DOM 事件绑定的区别是什么？
5. slot 的实现原理是什么？支持哪些类型的插槽？
6. 谈谈 Vue 中 $nextTick 的原理和应用场景。

#### 路由与状态管理
1. Vue Router 的导航守卫有哪些？它们的执行顺序是什么？
2. 动态路由和懒加载如何实现？
3. Vuex 的核心概念有哪些？如何使用它管理全局状态？
4. Vue3 中 Composition API 对 Vuex 的影响是什么？是否需要继续使用 Vuex？

#### 项目实践
1. 如果项目性能出现瓶颈，你会如何优化？
2. 如何在项目中使用第三方库，例如 ECharts、Axios 等？
3. 你在 Vue 项目中遇到过哪些难题？是如何解决的？
4. 如何设计一个可复用的组件？

### Vue 2 特有问题
1. Vue2 中的 Object.defineProperty 有哪些局限性？如何解决？
2. Vue2 如何处理数组变化检测的？为什么要用 Vue.set？
3. 在 Vue2 中如何用 $attrs 和 $listeners 实现父子组件通信？
4. Vue2 的 extend 方法和 mixin 有什么区别？

### Vue 3 特有问题
1. Vue3 中的 Composition API 是什么？与 Options API 的区别是什么？
2. Vue3 的响应式系统是如何改进的？谈谈 Proxy 的优点。
3. 如何使用 setup 函数？它的参数是什么？
4. Vue3 中的 ref 和 reactive 有什么区别？如何选择？
5. Vue3 的 Teleport 和 Suspense 是什么？它们的使用场景是什么？
6. 如何在 Vue3 中实现全局状态管理？是否需要 Vuex？
7. Vue3 中如何使用组合式函数（Composition Functions）来组织逻辑？
8. 如何迁移一个 Vue2 项目到 Vue3？

### 生态相关
1. Vue CLI 和 Vite 有什么区别？什么时候选择 Vite？
2. Vue 项目中如何集成 TypeScript？
3. 如何配置 Vue 的 SSR（服务端渲染）？
4. 谈谈 Vue3 和其他框架（React、Angular）的优劣对比。