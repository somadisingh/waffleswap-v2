import { useState, useEffect } from "react";
import Image from "next/image";
import ethereum from "../../public/ethereum.png";
import waffles from "../../public/waffles.png";
import { Button, BuySellSwitch, Label, TokenBox, FullButton } from "./ui";

export const BuyForm = (props) => {
  const [isValid, setIsValid] = useState(false);
  const [value, setValue] = useState(null);

  return (
    <div>
      <div className="float-right">
        <Label>
          Balance: {(props.ethBalance / 1000000000000000000).toFixed(2)} ETH
        </Label>
      </div>
      <TokenBox
        logo={ethereum}
        ticker="ETH"
        alt="eth logo"
        value={value}
        onChange={(e) => {
          // console.log(e.target.value);
          let val = e.target.value;

          if (val.length > 0) {
            if (!/([0-9.])$/.test(val)) {
              console.log("go away");
              setIsValid(false);
            } else {
              setIsValid(true);
              setValue(val);
            }
          } else {
            setIsValid(true);
            setValue(null);
          }
        }}
        isInValid={!isValid || value === 0.0}
      />

      <div className="float-right">
        <Label>
          Balance: {(props.wflBalance / 1000000000000000000).toFixed(2)} WFL
        </Label>
      </div>
      <TokenBox
        logo={waffles}
        ticker="WFL"
        alt="wfl logo"
        value={value * 100}
      />

      <div className="float-left">
        <Label>Exchange Rate:</Label>
      </div>
      <div className="float-right">
        <Label>1 ETH = 100 WFL</Label>
      </div>

      <FullButton
        emoji="🔃"
        disabled={!isValid || !value || props.loading}
        onClick={() => {
          props.onBuy(value);
        }}
      >
        SWAP{" "}
      </FullButton>
    </div>
  );
};

export const SellForm = (props) => {
  const [isValid, setIsValid] = useState(false);
  const [value, setValue] = useState(null);

  return (
    <div>
      <div className="float-right">
        <Label>
          Balance: {(props.wflBalance / 1000000000000000000).toFixed(2)} WFL
        </Label>
      </div>
      <TokenBox
        logo={waffles}
        ticker="WFL"
        alt="wfl logo"
        value={value}
        onChange={(e) => {
          // console.log(e.target.value);
          let val = e.target.value;

          if (val.length > 0) {
            if (!/([0-9.])$/.test(val)) {
              console.log("go away");
              setIsValid(false);
            } else {
              setIsValid(true);
              setValue(val);
            }
          } else {
            setIsValid(true);
            setValue(null);
          }
        }}
        isInValid={!isValid || value === 0.0}
      />

      <div className="float-right">
        <Label>
          Balance: {(props.ethBalance / 1000000000000000000).toFixed(2)} ETH
        </Label>
      </div>
      <TokenBox
        logo={ethereum}
        ticker="ETH"
        alt="eth logo"
        disabled={true}
        value={value / 100}
      />

      <div className="float-left">
        <Label>Exchange Rate:</Label>
      </div>
      <div className="float-right">
        <Label>1 WFL = 0.01 ETH</Label>
      </div>

      <FullButton
        emoji="🔃"
        disabled={!isValid || !value || props.loading}
        onClick={() => {
          props.onSell(value);
        }}
      >
        SWAP
      </FullButton>
    </div>
  );
};
