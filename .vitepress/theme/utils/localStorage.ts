export function set(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function get(key: string) {
  console.log("get => ", localStorage.getItem(key));

  return localStorage.getItem(key);
}
