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

### To Understand
1. B、C端？
2. 