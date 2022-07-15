import styled from "styled-components";
import { COLOR } from "./constant";
import { ReactComponent as Arrow } from "./assets/icon/arrow.svg";

type DiaplyProps = {
  type?: "buy" | "sell";
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
  }

  & > div:nth-child(1) {
    width: 40%;
    color: ${(p) =>
      p.type === "buy"
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
    background-color: ${(p) =>
      p.type === "buy"
        ? `${COLOR.BUY_QUOTE_ACCUMULATIVE}`
        : `${COLOR.SELL_QUOTE_ACCUMULATIVE}`};
  }
`;

const CenterDiaply = styled.div<DiaplyProps>`
  height: 30px;
  color: ${(p) =>
    p.type === "buy"
      ? `${COLOR.BUY_QUOTE_PRICE}`
      : `${COLOR.SELL_QUOTE_PRICE}`};
  background-color: ${(p) =>
    p.type === "buy"
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
  }
`;

export function PriceTable() {
  return (
    <Row>
      <div>21699.0</div>
      <div>3691</div>
      <div>5677</div>
    </Row>
  );
}

function App() {
  return (
    <Container>
      <Wrapper>
        <Heading>Order Book</Heading>
        <Row>
          <span>Price (USD)</span>
          <span>Size</span>
          <span>Total</span>
        </Row>
        <PriceTable />
        <PriceTable />
        <PriceTable />
        <PriceTable />
        <PriceTable />
        <PriceTable />
        <PriceTable />
        <PriceTable />
        <CenterDiaply type="buy">
          123 <Arrow />
        </CenterDiaply>
        <PriceTable />
        <PriceTable />
        <PriceTable />
        <PriceTable />
        <PriceTable />
        <PriceTable />
        <PriceTable />
        <PriceTable />
        <PriceTable />
      </Wrapper>
    </Container>
  );
}

export default App;
