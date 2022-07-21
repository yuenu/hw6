import { useState, useEffect } from "react";
import styled from "styled-components";
import { COLOR } from "./constant";
import { ReactComponent as Arrow } from "./assets/icon/arrow.svg";
import { TradeHistoryType, DataType, UpdateBTCPFC } from "./types";
import { parseNumber } from "./utils";

type DiaplyProps = {
  type?: "BUY" | "SELL";
  hint?: boolean;
  percentge?: number;
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 260px;
  background-color: ${COLOR.BG};
  font-weight: 500;
`;

const Heading = styled.div`
  color: ${COLOR.DEFAULT_TEXT};
  margin-bottom: 8px;
  border-bottom: 2px solid #1d283b;
  padding: 10px;
`;

const Row = styled.div<DiaplyProps>`
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

const CenterDiaply = styled.div<DiaplyProps>`
  height: 30px;
  color: ${(p) =>
    p.type === "BUY"
      ? `${COLOR.BUY_QUOTE_PRICE}`
      : `${COLOR.SELL_QUOTE_PRICE}`};
  background-color: ${(p) =>
    p.type === "BUY"
      ? `${COLOR.BUY_QUOTE_ACCUMULATIVE}`
      : `${COLOR.SELL_QUOTE_ACCUMULATIVE}`};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  margin: 0px 2px 10px 2px;

  & > svg {
    width: 18px;
    margin-left: 5px;
    transform: ${(p) => (p.type === "BUY" ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

type PriceTablePropsType = {
  priceType: "BUY" | "SELL";
  // quotes: TradeHistoryType["data"];
  quotes?: TablePropsType;
};

export function PriceTable({ priceType, quotes }: PriceTablePropsType) {
  return (
    <>
      {quotes &&
        quotes.data.length > 0 &&
        quotes.data.slice(0, 7).map((quote) => {
          let percentge = 0;
          if (quotes.AllTotal > 0 && quote.total > 0) {
            percentge = (quote.total / quotes.AllTotal) * 100;
          }
          console.log("total", quotes.AllTotal, quote.total);
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

export enum WebSocketState {
  CONNECTING = 0,
  OPEN,
  CLOSING,
  CLOSED,
  NOT_INIT,
}

const msg = {
  op: "subscribe",
  args: ["update:BTCPFC"],
};

const msg2 = {
  op: "subscribe",
  args: ["tradeHistoryApi:BTCPFC"],
};

type TablePropsType = {
  data: {
    price: string;
    size: string;
    total: number;
    hint: boolean;
  }[];
  AllTotal: number;
};

type SequenceType = {
  prevSeqNum: number;
  seqNum: number;
};

const initialTable = {
  data: [
    {
      price: "0",
      size: "0",
      total: 0,
      hint: false,
    },
  ],
  AllTotal: 0,
};

function connectWebsocket(url: string, params: any) {
  const ws = new WebSocket(url);
  ws.onopen = function () {
    ws.send(JSON.stringify(params));
  };

  return ws;
}

function App() {
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryType["data"]>(
    []
  );

  const [currentPriceData, setCurrentPriceData] =
    useState<TradeHistoryType["data"]>();

  const [bids, setBids] = useState<TablePropsType>(initialTable);
  const [asks, setAsks] = useState<TablePropsType>(initialTable);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sequenceData, setSequenceData] = useState<SequenceType>();

  function connectTradeHistorySocket() {
    const ws = connectWebsocket("wss://ws.btse.com/ws/futures", msg2);

    ws.onmessage = function (e) {
      const rawData = e.data as string;
      const parsedData = JSON.parse(rawData) as any;

      if (
        parsedData.topic === "tradeHistoryApi" &&
        parsedData.data.length === 50
      ) {
        setTradeHistory(parsedData.data);
      }

      if (
        parsedData.topic === "tradeHistoryApi" &&
        parsedData.data.length !== 50
      ) {
        setCurrentPriceData(parsedData.data);
      }
    };

    ws.onclose = function () {
      console.log("TradeHistory socket is close");
      setTimeout(function () {
        connectTradeHistorySocket();
      }, 1000);
    };
  }

  function connectUpdatedBTCSocket() {
    const ws = connectWebsocket("wss://ws.btse.com/ws/oss/futures", msg);

    ws.onclose = function () {
      console.log("UpdatedBTC socket is close");
      setTimeout(function () {
        connectUpdatedBTCSocket();
      }, 1000);
    };

    ws.onmessage = function (e) {
      const rawData = e.data as string;
      const parsedData = JSON.parse(rawData) as UpdateBTCPFC;
      if (parsedData.data?.type === DataType.SNAPSHOT) {
        let bidsTotalCount = 0;

        const parseBidsData = parsedData.data.bids.map((bid) => {
          bidsTotalCount += parseInt(bid[1], 10);
          return {
            price: bid[0],
            size: bid[1],
            total: bidsTotalCount,
            hint: false,
          };
        });

        let asksTotalCount = 0;
        let tempParseAsksData = parsedData.data.asks.map((ask) => {
          asksTotalCount += parseInt(ask[1], 10);
          return {
            price: ask[0],
            size: ask[1],
            hint: false,
          };
        });

        let tempCount = asksTotalCount;
        const parseAsksData = tempParseAsksData.map((item) => {
          const total = tempCount;
          tempCount = tempCount - parseInt(item.size, 10);
          return {
            ...item,
            total: total,
          };
        });

        setBids({
          data: parseBidsData,
          AllTotal: bidsTotalCount,
        });
        setAsks({
          data: parseAsksData,
          AllTotal: asksTotalCount,
        });

        setSequenceData({
          prevSeqNum: parsedData.data.prevSeqNum,
          seqNum: parsedData.data.seqNum,
        });
      }

      if (parsedData.data?.type === DataType.DELTA) {
        const asksList = parsedData.data.asks;
        const bidsList = parsedData.data.bids;
        const hasAsksList = asksList.length > 0;
        const hasBidsList = bidsList.length > 0;

        setSequenceData((prevSeq) => {
          if (prevSeq?.seqNum !== parsedData.data.prevSeqNum) {
            ws.close();
          }
          return {
            prevSeqNum: parsedData.data.prevSeqNum,
            seqNum: parsedData.data.seqNum,
          };
        });

        if (hasBidsList) {
          bidsList.forEach((newBid: string[]) => {
            setBids((prevBids) => {
              if (!prevBids) return prevBids;
              const newBids = { ...prevBids };
              const target = newBids.data.filter(
                (bid) => bid.price === newBid[0]
              );
              let newCeilData = {
                price: newBid[0],
                size: newBid[1],
                total: parseInt(newBid[1], 10),
                hint: true,
              };

              const foundTarget = target.length > 0;
              if (foundTarget) {
                const targetIndex = newBids.data.indexOf(target[0]);
                if (newBid[1] === "0") {
                  prevBids.AllTotal = prevBids.AllTotal - target[0].total;
                  newBids.data.splice(targetIndex, 1);
                } else {
                  prevBids.AllTotal = prevBids.AllTotal + target[0].total;
                  newCeilData.total = target[0].total + parseInt(newBid[1], 10);
                  newBids.data.splice(targetIndex, 1, newCeilData);
                }
              }

              if (!foundTarget) {
                newBids.data.push(newCeilData);
                newBids.data.sort(
                  (a, b) => parseInt(b.price, 10) - parseInt(a.price, 10)
                );
              }
              return prevBids;
            });

            setTimeout(() => {
              setBids((prev) => {
                const newData = prev.data.map((item) => {
                  return { ...item, hint: false };
                });

                return {
                  data: newData,
                  AllTotal: prev.AllTotal,
                };
              });
            }, 500);
          });
        }

        if (hasAsksList) {
          asksList.forEach((newAsk: string[]) => {
            setAsks((prevAsks) => {
              if (!prevAsks) return prevAsks;
              const newAsks = { ...prevAsks };
              const target = newAsks.data.filter(
                (ask) => ask.price === newAsk[0]
              );
              let newCeilData = {
                price: newAsk[0],
                size: newAsk[1],
                total: parseInt(newAsk[1], 10),
                hint: true,
              };

              const foundTarget = target.length > 0;

              if (foundTarget) {
                const targetIndex = newAsks.data.indexOf(target[0]);
                if (newAsk[1] === "0") {
                  prevAsks.AllTotal = prevAsks.AllTotal - target[0].total;
                  newAsks.data.splice(targetIndex, 1);
                } else {
                  prevAsks.AllTotal = prevAsks.AllTotal + target[0].total;
                  newCeilData.total = target[0].total + parseInt(newAsk[1], 10);
                  newAsks.data.splice(targetIndex, 1, newCeilData);
                }
              }

              if (!foundTarget) {
                newAsks.data.push(newCeilData);
                newAsks.data.sort(
                  (a, b) => parseInt(b.price, 10) - parseInt(a.price, 10)
                );
              }
              return newAsks;
            });

            setTimeout(() => {
              setAsks((prev) => {
                const newData = prev.data.map((item) => {
                  return { ...item, hint: false };
                });

                return {
                  data: newData,
                  AllTotal: prev.AllTotal,
                };
              });
            }, 500);
          });
        }
      }
    };
  }

  useEffect(() => {
    connectTradeHistorySocket();
    connectUpdatedBTCSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      {tradeHistory.length > 0 && (
        <Wrapper>
          <Heading>Order Book</Heading>
          <Row>
            <span>Price (USD)</span>
            <span>Size</span>
            <span>Total</span>
          </Row>
          <PriceTable priceType="SELL" quotes={asks} />
          {currentPriceData ? (
            <CenterDiaply type={currentPriceData[0].side}>
              {parseNumber(currentPriceData[0].price)} <Arrow />
            </CenterDiaply>
          ) : (
            <CenterDiaply type={tradeHistory[0].side}>
              {parseNumber(tradeHistory[0].price)} <Arrow />
            </CenterDiaply>
          )}
          <PriceTable priceType="BUY" quotes={bids} />
        </Wrapper>
      )}
    </Container>
  );
}

export default App;
