import moment from "moment";

export function getShorthandDate(date: string) {
  const isCurrentYear = moment(date).year() === moment(Date.now()).year();
  const format = isCurrentYear ? "MMM D" : "MMM D, YYYY";
  return moment(date).format(format);
}
