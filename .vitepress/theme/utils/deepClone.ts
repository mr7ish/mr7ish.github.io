export function deepClone<T>(obj: T): T {
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
