import html2canvas from "html2canvas";
import { createAnchor, createImage } from "./factory";

type CaptureScreenOptions = {
  /**
   * 是否截全屏
   */
  isFullScreen?: boolean;
  /**
   * 截屏目标内容
   */
  target?: HTMLElement;
  /**
   * 用途
   */
  usage?: "open_window" | "download";
};

/**
 * 基于 html2canvas 实现截屏功能
 */
export const captureScreen = async (options: CaptureScreenOptions) => {
  const {
    isFullScreen = false,
    target = document.body,
    usage = "download",
  } = options;

  const content = isFullScreen ? document.body : target;

  const canvas = await html2canvas(content);

  const base64Data = canvas.toDataURL();
  console.log("base64Data =>", base64Data);

  if (usage === "open_window") {
    const img = createImage(base64Data);
    const newWindow = window.open();
    newWindow?.document.write(img.outerHTML);
  }

  if (usage === "download") {
    const anchor = createAnchor(base64Data);
    anchor.download = "screenshot";
    anchor.click();
  }

  return {
    base64URL: base64Data,
  };
};
