import { getSuffix } from "./getFileSuffix";

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
    shuffleds: shuffleArray(pictures),
  };
};

function whiteList() {
  return ["png", "jpg", "gif"];
}

function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
