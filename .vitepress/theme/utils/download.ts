import { notice } from "./notice";

/**
 * download source
 */
// export function download(source: string, name?: string) {
//   const anchor = createAnchor(source);
//   anchor.download = name ?? "download";
//   anchor.click();
//   notice("download success", "success");
// }

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

      notice("download success", "success");
    })
    .catch((_error) => notice("download error", "error"));
}
