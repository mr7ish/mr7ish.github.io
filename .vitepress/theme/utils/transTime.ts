import moment from "moment";

/**
 * 将数值转换为时间
 */
export function transTime(
  time: number,
  unit: moment.DurationInputArg2 = "seconds"
) {
  return moment.duration(time, unit);
}
