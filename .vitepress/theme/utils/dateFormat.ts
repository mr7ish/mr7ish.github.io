import moment from "moment";

export function getShorthandDate(date: string) {
  const isCurrentYeat = moment(date).year() === moment(Date.now()).year();
  const format = isCurrentYeat ? "MMM D" : "MMM D, YYYY";
  return moment(date).format(format);
}
