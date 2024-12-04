---
createTime: 2024-12-04
tags:
  - vue
  - interview
cover: /Arcane-Jinx.png
---

- ### vue 的响应式原理

Vue 的响应式系统基于 数据代理 和 观察者模式，核心思想是：当数据变化时，视图会自动更新。Vue 通过劫持对象的属性并监听属性的变化，来实现响应式数据绑定。

#### Vue 的响应式系统由以下几个核心部分组成：

- 数据劫持（Data Hijacking）：Vue 通过 Object.defineProperty() 或 Proxy API，劫持对象的属性，在数据变化时能够捕获变化并通知视图更新。

- 依赖收集（Dependency Collection）：当组件渲染时，Vue 会记录每个依赖于数据的视图部分（即每个依赖于数据的计算属性或模板），当数据变化时，Vue 知道哪些部分需要更新。

- 观察者模式（Observer Pattern）：Vue 通过 Observer 模式将数据与视图绑定，确保数据变化时自动更新视图。

Vue 2.x 的响应式系统使用 Object.defineProperty() 来劫持对象的属性和监听数据变化。

Vue 3.x 对响应式的实现进行了优化，使用了 Proxy API 替代了 Object.defineProperty()，实现了更灵活、更高效的响应式系统。