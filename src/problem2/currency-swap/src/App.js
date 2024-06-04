import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 320px;
  margin-top: 20px;
  background-color: #fff;
  padding: 36px 24px;
  border-radius: 12px;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  background-color: #9200b0;
  color: white;
  border: none;
  border-radius: 5px;

  &:disabled {
    background-color: #ccc;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const CurrencySelect = styled.select`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  width: 100%;
`;

const TokenImage = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const Loading = styled.div`
  margin-top: 20px;
  font-size: 18px;
`;

function App() {
  const BASE_ICON_URL =
    "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";
  const FROM_SELECT = "FROM";
  const TO_SELECT = "TO";
  const [priceKeys, setPriceKeys] = useState([]);
  const [prices, setPrices] = useState({});
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectStatus, setSelectStatus] = useState({
    from: false,
    to: false,
  });

  useEffect(() => {
    const fetchTokensAndPrices = async () => {
      try {
        const pricesResponse = await axios.get(
          "https://interview.switcheo.com/prices.json"
        );
        const data = pricesResponse.data;
        data.map(
          (item) => (item.icon = `${BASE_ICON_URL}${item.currency}.svg`)
        );
        let relData = [];
        let relDataCurrency = [];
        for (let item of data) {
          if (relDataCurrency.indexOf(item.currency.toUpperCase()) == -1) {
            relData.push(item);
            relDataCurrency.push(item.currency.toUpperCase());
          }
        }
        setPriceKeys(Object.keys(relData));
        setPrices(relData);
      } catch (error) {
        console.error("Error fetching tokens and prices:", error);
      }
    };

    fetchTokensAndPrices();
  }, []);

  const handleSwap = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!fromToken || !toToken || !amount || isNaN(amount)) {
      setError("Please enter valid inputs");
      setLoading(false);
      return;
    }

    if (!prices[fromToken] || !prices[toToken]) {
      setError("Selected tokens are not supported");
      setLoading(false);
      return;
    }

    const fromPrice = prices[fromToken].price;
    const toPrice = prices[toToken].price;
    const resultAmount = (amount * fromPrice) / toPrice;

    setResult(resultAmount.toFixed(2));
    setLoading(false);
  };

  const toggleSelected = (status) => {
    console.log("toggleSelected", status);
    switch (status) {
      case FROM_SELECT:
        if (selectStatus.from) {
          setSelectStatus({
            from: false,
            to: false,
          });
        } else {
          setSelectStatus({
            from: true,
            to: false,
          });
        }
        break;
      case TO_SELECT:
        if (selectStatus.to) {
          setSelectStatus({
            from: false,
            to: false,
          });
        } else {
          setSelectStatus({
            from: false,
            to: true,
          });
        }
        break;
      default:
        break;
    }
  };
  const onMouseOutClick = (status) => {
    console.log("on mouse out", status);
  };
  const onSelectItem = (status, item) => {
    setResult(false);
    if (status == FROM_SELECT) {
      setFromToken(item);
    } else if (status == TO_SELECT) {
      setToToken(item);
    }
    setSelectStatus({
      from: false,
      to: false,
    });
  };
  return (
    <AppContainer className="content-wrapper">
      <Form onSubmit={handleSwap}>
        <h1 className="text-center">Currency Swap</h1>
        {/* FROMMMMMMMM */}
        <div className="d-flex gap-1 mb-2">
          <div className="w-50">
            <div className="w-100">
              <label className="text-bold mb-1">From</label>
              <div
                className="custom-select"
                onClick={(e) => toggleSelected(FROM_SELECT)}
              >
                <div className="select-selected">
                  {prices[fromToken] ? (
                    <div>
                      <img src={prices[fromToken].icon} alt="" />
                      {prices[fromToken].currency}
                    </div>
                  ) : (
                    "--"
                  )}
                </div>
                {selectStatus.from ? (
                  <div className="select-items">
                    {priceKeys.map((item) => (
                      <div
                        className="custom-option"
                        onClick={(e) => onSelectItem(FROM_SELECT, item)}
                      >
                        <img src={prices[item].icon} alt="" />
                        {prices[item].currency}
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {/* TOOOOO */}
          <div className="w-50">
            <div className="w-100">
              <label className="text-bold mb-1">To</label>
              <div
                className="custom-select"
                onClick={(e) => toggleSelected("TO")}
              >
                <div className="select-selected">
                  {prices[toToken] ? (
                    <div>
                      <img src={prices[toToken].icon} alt="" />
                      {prices[toToken].currency}
                    </div>
                  ) : (
                    "--"
                  )}
                </div>
                {selectStatus.to ? (
                  <div className="select-items">
                    {priceKeys.map((item) => (
                      <div
                        className="custom-option"
                        onClick={(e) => onSelectItem(TO_SELECT, item)}
                      >
                        <img src={prices[item].icon} alt="" />
                        {prices[item].currency}
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <label className="text-bold mb-1">Enter Amount</label>
        <Input
          className="border"
          type="text"
          value={amount}
          onChange={(e) => {
            setResult(false);
            setAmount(e.target.value);
          }}
          placeholder="Amount"
        />
        {loading && <Loading>Loading...</Loading>}
        {result && (
          <h3>
            {amount} {prices[fromToken].currency} = {result}{" "}
            {prices[toToken].currency}
          </h3>
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button type="submit" disabled={loading}>
          Swap
        </Button>
      </Form>
    </AppContainer>
  );
}

export default App;
