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

export function getSuffix(path: string) {
  const match = path.match(/\.[^/.]+$/);
  return match ? match[0].slice(1) : "";
}

function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
