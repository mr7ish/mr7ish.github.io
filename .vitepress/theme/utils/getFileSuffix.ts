export function getSuffix(path: string) {
  const match = path.match(/\.[^/.]+$/);
  return match ? match[0].slice(1) : "";
}
