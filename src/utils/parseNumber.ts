export const parseNumber = (num: number) => {
  return num > 999 ? num.toString().slice(0, -3) + "k" : num.toString();
};
