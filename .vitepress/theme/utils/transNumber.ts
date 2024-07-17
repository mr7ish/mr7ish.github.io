/**
 * 数值补0
 */
export function transNumber(num: number, range: number = 10) {
  let str = "";
  for (let i = 0; i < range.toString().length - num.toString().length; i++) {
    str += "0";
  }
  return num < range ? `${str}${num}` : num + "";
}
