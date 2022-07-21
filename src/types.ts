export type TradeHistoryType = {
  topic: "tradeHistoryApi";
  id: null | number;
  data: TradeDataType[];
};

export type TradeDataType = {
  symbol: "BTCPFC";
  side: "SELL" | "BUY";
  size: number;
  price: number;
  tradeId: number;
  timestamp: number;
};

export type UpdateBTCPFC = {
  topic: "update:BTCPFC";
  data: {
    bids: string[][];
    asks: string[][];
    seqNum: number;
    prevSeqNum: number;
    type: "delta" | "snapshot";
    symbol: "BTCPFC";
    timestamp: number;
  };
};

export enum DataType {
  DELTA = "delta",
  SNAPSHOT = "snapshot",
}

export type TablePropsType = {
  data: {
    price: string;
    size: string;
    total: number;
    hint: boolean;
  }[];
  AllTotal: number;
};

export type RowProps = {
  type?: "BUY" | "SELL";
  hint?: boolean;
  percentge?: number;
};
