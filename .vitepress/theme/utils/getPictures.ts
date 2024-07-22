import { deepClone } from "./deepClone";
import { getSuffix } from "./getFileSuffix";
import { shuffleArray } from "./shuffleArray";

export default () => {
  const modules: Record<string, { default: string }> = import.meta.glob(
    "../../../site/public/*",
    {
      eager: true,
    }
  );

  const pictures = Object.values(modules)
    .map((i) => ({
      path: i.default.replace("/public", ""),
      name: i.default
        .replace("/public/", "")
        .replace("." + getSuffix(i.default), ""),
    }))
    .filter((i) => whiteList().includes(getSuffix(i.path)));

  return {
    pictures,
    shuffleds: shuffleArray(deepClone(pictures)),
  };
};

function whiteList() {
  return ["png", "jpg", "gif"];
}
