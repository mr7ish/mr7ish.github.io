export default (arr: number[]) => {
  return arr.reduce((accumulator, currentValue) => {
    return typeof currentValue === "number"
      ? accumulator + currentValue
      : accumulator;
  }, 0);
};
