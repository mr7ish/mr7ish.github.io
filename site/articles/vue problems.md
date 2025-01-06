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