import { notice } from "./notice";

/**
 * create an anchor object
 */
export function createAnchor(href: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  return anchor;
}

/**
 * download source
 */
export function download(source: string, name?: string) {
  const anchor = createAnchor(source);
  anchor.download = name ?? "download";
  anchor.click();
  notice("download success", "success");
}
