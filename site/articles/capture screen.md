---
createTime: 2024-05-17
tags:
  - utils
cover: /beauty.jpg
---

### 实现截屏功能

基于 [html2canvas](https://html2canvas.hertzen.com/)

```typescript
import html2canvas from 'html2canvas';
import { createAnchor, createImage } from './factory';

type CaptureScreenOptions = {
  /**
   * 是否截全屏
   */
  isFullScreen?: boolean
  /**
   * 截屏目标内容
   */
  target?: HTMLElement
  /**
   * 用途
   */
  usage?: 'open_window' | 'download'
}

/**
 * 基于 html2canvas 实现截屏功能
 */
export const captureScreen = async (options: CaptureScreenOptions) => {
  const {
    isFullScreen = false,
    target = document.body,
    usage = 'download',
  } = options;

  const content = isFullScreen ? document.body : target;

  const canvas = await html2canvas(content);

  const base64Data = canvas.toDataURL();
  console.log('base64Data =>', base64Data);

  if (usage === 'open_window') {
    const img = createImage(base64Data);
    const newWindow = window.open();
    newWindow?.document.write(img.outerHTML);
  }

  if (usage === 'download') {
    const anchor = createAnchor(base64Data);
    anchor.download = 'screenshot';
    anchor.click();
  }

  return {
    base64URL: base64Data
  }
};
```

factory.ts
```typescript
/**
 * create an image object
 * @param imagePath image source
 * @returns an img element
 */
export function createImage(imagePath: string) {
  const image = new Image();
  image.src = imagePath;
  return image;
}

/**
 * create an anchor object
 * @param href anchor href
 * @returns an a element
 */
export function createAnchor(href: string) {
  const anchor = document.createElement('a');
  anchor.href = href;
  return anchor;
}
```