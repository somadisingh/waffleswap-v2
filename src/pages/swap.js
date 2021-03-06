import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import waffles from "../../public/waffles.png";
import {
  Button,
  BuySellSwitch,
  Label,
  TokenBox,
  FullButton,
} from "../components/ui";
import { BuyForm, SellForm } from "../components/forms";
import Web3 from "web3";
import Token from "../abis/Token.json";
import WaffleSwap from "../abis/WaffleSwap.json";

const buyQuotes = [
  ["Get Your Waffle", "🧇"],
  ["Here's Some Sweet Waffle", "🍰"],
  ["Eat Your Waffle", "🍽️"],
  ["Waffle Goes In", "↙️"],
  ["Come On! Let's Pump Some Waffle", "💪"],
];
const sellQuotes = [
  ["Get Your Ethereum", "🪙"],
  ["Dump Your Waffle", "🤮"],
  ["Sure you wanna say goodbye to Waffles?", "🥺"],
  ["Waffle Goes Out", "↗️"],
  ["Hate to see you dump waffle", "😿"],
];

export default function Exchange() {
  const router = useRouter();
  const [state, setState] = useState("buy");
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState();
  const [waffleSwap, setWaffleSwap] = useState();

  const [ethBalance, setEthBalance] = useState(0);
  const [wflBalance, setWflBalance] = useState(0);
  const [address, setAddress] = useState("0x0000000000");

  // Load blockchain on page load
  useEffect(async () => {
    await loadWeb3();
    await loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    const _address = accounts[0];
    setAddress(_address);

    const _ethBalance = await web3.eth.getBalance(_address);
    setEthBalance(_ethBalance);

    console.log(_ethBalance, _address);

    //Load Token
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const _token = new web3.eth.Contract(Token.abi, tokenData.address);
      setToken(_token);

      let _tokenBalance = await _token.methods.balanceOf(_address).call();
      setWflBalance(_tokenBalance);
      console.log(_tokenBalance);
    } else {
      alert("Please deploy the Token contract on the detected network");
    }

    //Load Waffleswap contract
    const waffleData = WaffleSwap.networks[networkId];
    if (waffleData) {
      const _waffleSwap = new web3.eth.Contract(
        WaffleSwap.abi,
        waffleData.address
      );
      setWaffleSwap(_waffleSwap);
    } else {
      window.alert(
        "Please deploy the WaffleSwap contract on the detected network"
      );
    }
  };

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.send("eth_requestAccounts");
      console.log("New browser");
    } else if (window.web3) {
      window.web3 = new Web3(window.ethereum);
      console.log("Old browser");
    } else {
      alert("Non-Ethereum browser! Use Metamask");
    }
  };

  const buyTokens = async (value) => {
    let etherAmount = window.web3.utils.toWei(value, "Ether");
    let hash = await waffleSwap.methods
      .buyTokens()
      .send({ value: etherAmount, from: address });
    console.log(hash);

    await loadBlockchainData();
  };

  const sellTokens = async (value) => {
    let wflAmount = window.web3.utils.toWei(value, "Ether");
    console.log(waffleSwap._address, address, wflAmount);

    let hash = await token.methods
      .approve(waffleSwap._address, wflAmount)
      .send({ from: address });
    console.log(hash);

    await waffleSwap.methods.sellTokens(wflAmount).send({ from: address });
    console.log(hash);

    await loadBlockchainData();
  };

  return (
    <div>
      <Head>
        <title>WaffleSwap</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-between items-start">
        <div
          className="mt-5 ml-5 cursor-pointer flex items-center"
          onClick={() => router.push("/")}
        >
          <Image src={waffles} alt="Logo" width="50" height="50" />{" "}
          <span className="font-bold text-white text-xl">WaffleSwap</span>
        </div>
        <div className="mt-2 mr-2 p-2 rounded-2xl text-purple-900 bg-purple-500 font-bold text-xl text-center">
          {address.slice(0, 6)}...
          {address.slice(address.length - 4, address.length)}
          {/* {address} */}
        </div>
      </div>

      <div className="md:container md:w-2/5 md:mt-10 space-y-4 mx-4">
        <BuySellSwitch state={state} setState={setState}>
          Buy
        </BuySellSwitch>
        <div className="w-xl p-6 text-left rounded-3xl shadow-lg backdrop-blur-3xl bg-gray-600/25">
          {state == "buy" ? (
            <BuyForm
              ethBalance={ethBalance}
              wflBalance={wflBalance}
              loading={loading}
              onBuy={buyTokens}
            />
          ) : (
            <SellForm
              wflBalance={wflBalance}
              ethBalance={ethBalance}
              loading={loading}
              onSell={sellTokens}
            />
          )}
        </div>
      </div>
    </div>
  );
}
