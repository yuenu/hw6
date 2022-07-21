import styled from "styled-components";
import { RowProps } from "../types";

import { COLOR } from "../constant";

export const Row = styled.div<RowProps>`
  display: flex;
  padding: 0 10px;

  & > span {
    color: ${COLOR.TAB_HEAD_TEXT};
    font-size: 12px;
    margin-bottom: 10px;
  }

  & > span:nth-child(1) {
    width: 40%;
  }

  & > span:nth-child(2) {
    width: 20%;
    text-align: end;
  }

  & > span:nth-child(3) {
    width: 40%;
    text-align: end;
  }

  & > div {
    color: ${COLOR.TAB_HEAD_TEXT};
    font-size: 14px;
    margin-bottom: 10px;
    background-color: ${(p) =>
      p.hint
        ? p.type === "BUY"
          ? `${COLOR.FLASH_GREEN_BG}`
          : `${COLOR.FLASH_RED_BG}`
        : "transparent"};
    transition: 500ms;
  }

  & > div:nth-child(1) {
    width: 40%;
    color: ${(p) =>
      p.type === "BUY"
        ? `${COLOR.BUY_QUOTE_PRICE}`
        : `${COLOR.SELL_QUOTE_PRICE}`};
  }

  & > div:nth-child(2) {
    width: 20%;
    text-align: end;
    color: ${COLOR.DEFAULT_TEXT};
  }

  & > div:nth-child(3) {
    width: 40%;
    text-align: end;
    color: ${COLOR.DEFAULT_TEXT};
    position:relative;

    &::before {
      content: '';
      position: absolute;
      right:0;
      top:0;
      height: 16px;
      width: ${(p) => (p.percentge ? p.percentge : 0)}%;
      background-color: ${(p) =>
        p.hint
          ? p.type === "BUY"
            ? `${COLOR.BUY_QUOTE_ACCUMULATIVE}`
            : `${COLOR.SELL_QUOTE_ACCUMULATIVE}`
          : "transparent"};
    }
`;
