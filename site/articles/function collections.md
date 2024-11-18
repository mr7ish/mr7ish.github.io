---
createTime: 2024-11-18
tags:
  - utils
cover: /三叶.png
---


### 安全的 JSON Parse
```ts
type Params<T> = {
  jsonString: string;
  defaultValue?: T;
  logError?: boolean;
};

export const safeJsonParse = <T>({
  jsonString,
  defaultValue,
  logError = true,
}: Params<T>): T | undefined => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    if (logError) {
      console.error('Json parse error:', error);
    }
    return defaultValue;
  }
};
```

### 下载资源
```ts
/**
 * @params fileName eg.下载 png 文件， fileName 要填 xxx.png 
 */
export function download(imageUrl: string, fileName: string) {
  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("download success");
    })
    .catch((_error) => console.log("download error"));
}
```


### 深克隆
```ts
export function cloneDeep<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    const arrCopy: any[] = [];
    obj.forEach((item, index) => {
      arrCopy[index] = deepClone(item);
    });
    return arrCopy as unknown as T;
  }

  const objCopy: { [key: string]: any } = {};
  Object.keys(obj).forEach((key) => {
    objCopy[key] = deepClone((obj as { [key: string]: any })[key]);
  });

  return objCopy as T;
}
```

### 导出 excel
```ts
import XLSX from 'xlsx';

type AnyObject = Record<PropertyKey, any>;

/**
 * @params data { 属性: 值 } 对象数组，属性为列标题，值为对应列的值
 */
export const exportToExcel = (data: AnyObject[], title?: string) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${title ?? '导出数据'}.xlsx`);
};
```

### 根据接口获取所有数据
```ts
type BasicListParams = {
  page?: number;
  limit?: number;
};

type QueryFn<T> = (params: BasicListParams) => Promise<{
  data: T[];
  total: number;
}>;

export const getAllDatas = <T>(queryFn: QueryFn<T>, limit = 500) => {
  let options: any[] = [];

  const getData = async () => {
    let page = 1;

    const { data, total } = await queryFn({ page, limit });

    if (data.length >= 0) {
      options = [...data];
    }

    if (total && total > limit) {
      const diff = Math.ceil(total / limit);

      while (page < diff) {
        const { data: d } = await queryFn({ page: ++page, limit });
        if (d.length > 0) {
          options = [...options, ...d];
        }
      }
    }
  };

  getData();

  return {
    data: options as unknown as T[],
  };
};
```

### blob 数据转换为 base64 数据
```ts
function blobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = (_error) => {
      reject(null);
    };
    reader.readAsDataURL(blob);
  });
}
```