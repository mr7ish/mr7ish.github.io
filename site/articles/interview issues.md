---
createTime: 2024-12-04
tags:
  - interview
cover: /三叶.png
---

### self introduction

你好，我叫 xxx ，毕业于 xxx 学校 xxx 专业，目前有 x 年相关工作经验。
熟悉使用 vue、react、typescript 等技术进行开发。
我上一家公司主要是做 道路监管 相关方面的业务，
我参与了 交通全域数字化信息管理平台 等项目的开发，负责过实时监控模块的功能、
在工作中不断积累开发经验，注重代码的质量和可维护性，对复用度高的代码有意识的进行抽离封装。


实时监控：
  最基本的功能是在地图上对车辆进行定位打点，当选择的车辆过多时进行聚合显示，
  默认地图是放大显示的，点击车辆可以顺滑平移缩放到详细的位置，并展示车辆相关的数据信息。
  区域查车功能，在地图上框定一个范围，查询在该范围内的车辆。
  电子围栏功能，通过在地图上绘制点、线、面设置一个区域，当车辆进入或离开该区域时，系统可以触发特定的事件或动作。（监管车辆的位置、记录轨迹）

```ts
/**
 * 聚合点需要的参数
 */
export type ClustererMarker = { lnglat: AMap.Vector2 } & AnyObject;

/**
 * 重建聚合配置项类型
 */
export interface RebuildMarkerClustererOptions extends MarkerClustererOptions {
  renderMarker: (context: { count: number; data: AnyObject[] }) => void;
}

type UseMarkerClustererParams<T> = {
  // 地图实例
  mapInstance: Ref<AMap.Map | null>;
  // 初始点标记
  markers?: ClustererMarker[];
  // 聚合配置
  options?: RebuildMarkerClustererOptions;
  // 点击事件回调
  clickCb?: (e: CbEvent<T>) => void;
};
```

```ts
// 请求文件地址，拿到压缩包的 ArrayBuffer 类型的数据
async fetchZip(url: string, isCustomUrl: boolean = false) {
  const res = await uni.request({
    method: 'GET',
    url: isCustomUrl ? url : getOssPrefix() + url,
    responseType: 'arraybuffer'
  });

  return res.data as ArrayBuffer;
}

// 通过 jszip 的 loadAsync 方法遍历得到压缩包里每个文件的数据
async unzip(zipData: ArrayBuffer) {
  const zip = new JSZip();
  const result = await zip.loadAsync(zipData);

  const files: {
    name: string
    content: Promise<ArrayBuffer>
  }[] = [];

  result.forEach(async (relativePath, file) => {
    if (!file.dir) {
      files.push({
        name: file.name,
        content: file.async('arraybuffer'),
      });
    }
  });

  const queue = files.map(async (file) => ({
    name: file.name,
    content: await file.content,
  }));

  const res = await Promise.all(queue);
  return res;
}


// 要预览某个文件，只需通过 uni 的 文件管理器对象 在本地写入该文件得到 一个本地文件地址就可以了
uni.getFileSystemManager()
```

### 你对未来的规划或职业规划


### 你在工作中遇到了困难并通过什么方式解决了



### 站在前端开发的角度，描述一下给你一个任务你打算怎么做

- 需求分析：理解任务目标、用户需求和技术要求。
- 规划与设计：拆解功能，选择技术栈，确认与后端的 API 接口。
- 开发实现：模块化开发，完成页面布局、交互、数据请求和组件化功能。
- 测试优化：进行功能、性能、兼容性测试，并优化代码。
- 部署上线：打包部署，确保生产环境正常运行。
- 维护与迭代：根据反馈进行功能优化和修复。

::: details
1. 需求分析与理解
任务背景：首先，我会深入了解任务的背景、目标和需求，确保自己清楚要实现的功能是什么。
用户需求：根据需求文档、设计稿和与产品经理或相关人员的沟通，明确目标用户是谁，他们的痛点和期望是什么。
技术要求：确认任务是否有技术上的特定要求，比如是否需要支持某些浏览器，是否有性能、可访问性或安全性等方面的限制。

2. 功能设计与架构规划
功能拆解：将任务分解成多个小的子任务，逐步实现各个功能模块。比如，如果任务是开发一个数据展示页面，可能需要拆解成数据请求、页面布局、交互设计、数据渲染等几个部分。
技术选型：根据项目需求选择合适的技术栈。例如，如果任务需要组件化开发，我会选择 React 或 Vue；如果是需要高性能的数据处理，我可能会考虑引入 Web Worker 或优化渲染的方式。
API 设计：与后端团队确认 API 接口的设计，包括接口文档、请求参数、返回数据格式等，确保前后端能够顺利对接。

3. 开发与实现
组件开发：如果是一个较大的前端任务，我会将功能模块化，使用合适的框架（如 React/Vue）开发可复用的组件。例如，开发一个表单组件，或者开发一个数据展示表格组件，确保代码的可维护性。
样式设计：根据设计稿实现页面的样式，使用 CSS 或 CSS 预处理器（如 Sass、Less）。如果是响应式设计，需要考虑不同屏幕尺寸的适配。
数据交互：实现与后端的 API 对接，使用 axios 或 fetch 等方式请求数据，并处理返回的数据。如果需要管理状态，我会使用 Redux 或 Vuex 来做全局状态管理。
交互与功能实现：实现页面的交互逻辑，例如按钮点击、表单提交、弹窗展示、分页、排序等功能。确保用户体验流畅，交互设计符合预期。

4. 测试与优化
功能测试：确保实现的功能按预期工作，进行单元测试和集成测试，使用工具如 Jest、Mocha 等进行自动化测试。
性能优化：对页面进行性能分析，使用 Chrome DevTools 或其他工具检测性能瓶颈，进行优化。比如懒加载、减少 HTTP 请求、图片压缩、代码分割等。
兼容性测试：确保任务在各大浏览器上都能正常运行，使用 Autoprefixer 自动处理样式前缀，或使用 Babel 转译 JavaScript 代码，确保兼容性。

5. 部署与上线
部署打包：使用 Webpack、Vite 等工具将代码打包，生成生产环境代码。如果是单页面应用（SPA），确保路由、缓存等配置无误。
上线监控：在应用上线后，监控其运行状况，包括性能、错误、用户反馈等，及时修复可能出现的问题。
维护与迭代：根据用户馈和产品需求的变化，进行后续的功能扩展和优化。

6. 文档与协作
代码文档：编写清晰的代码注释，确保代码可读性和可维护性。
开发文档：整理开发流程、技术决策、API 接口等内容，便于团队成员理解和协作。
团队沟通：定期与团队成员沟通项目进展，确保大家步调一致，避免遗漏或重复工作。
:::



### 你还有什么问题吗

1.公司对我这个职位的期望是什么？

2.您希望我在短期内解决哪些问题？









### To Understand
1. B、C端？
2. 