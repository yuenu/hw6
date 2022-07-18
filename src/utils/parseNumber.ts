export const parseNumber = (num: string | number) => {
  let rawNum = "";
  if (typeof num === "number") rawNum = String(num);
  else rawNum = num;

  const parseFloatNumber = rawNum.split(".");
  const targetNum = parseFloatNumber[0];
  let res = "";
  let count = 0;
  for (let i = targetNum.length - 1; i >= 0; i--) {
    res = targetNum[i] + res;
    count = count + 1;
    if (count % 3 === 0) res = "," + res;
  }
  if (parseFloatNumber.length === 1) {
    return res + ".0";
  }

  return res + `.${parseFloatNumber[1]}`;
};
