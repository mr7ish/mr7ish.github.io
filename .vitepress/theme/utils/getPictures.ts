import { deepClone } from "./deepClone";
import { getSuffix } from "./getFileSuffix";
import { shuffleArray } from "./shuffleArray";

export default () => {
  // @ts-ignore
  const modules: Record<string, { default: string }> = import.meta.glob(
    "../../../site/public/*",
    {
      eager: true,
    }
  );

  const pictures = Object.entries(modules)
    .map(([sourcePath, image]) => ({
      path: image.default.replace("/public", ""),
      name: getPictureName(sourcePath),
    }))
    .filter((i) => whiteList().includes(getSuffix(i.path)));

  return {
    pictures,
    shuffleds: shuffleArray(deepClone(pictures)),
  };
};

function whiteList() {
  return ["png", "jpg", "jpeg", "gif", "webp"];
}

function getPictureName(path: string) {
  const normalizedPath = decodeURI(path.split("?")[0]);
  const fileName = normalizedPath.split("/").pop() ?? normalizedPath;

  return fileName.replace(/\.[^/.]+$/, "");
}
