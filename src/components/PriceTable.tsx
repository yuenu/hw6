import { TablePropsType } from "../types";
import { parseNumber } from "../utils";
import { Row } from "./Row";

type PropsType = {
  priceType: "BUY" | "SELL";
  quotes?: TablePropsType;
};

export function PriceTable({ priceType, quotes }: PropsType) {
  return (
    <>
      {quotes &&
        quotes.data.length > 0 &&
        quotes.data.slice(0, 7).map((quote) => {
          let percentge = 0;
          if (quotes.AllTotal > 0 && quote.total > 0) {
            percentge = (quote.total / quotes.AllTotal) * 100;
          }
          return (
            <Row
              type={priceType}
              key={quote.price}
              hint={quote.hint}
              percentge={percentge}
            >
              <div>{parseNumber(quote.price)}</div>
              <div>{quote.size}</div>
              <div>{quote.total}</div>
            </Row>
          );
        })}
    </>
  );
}
