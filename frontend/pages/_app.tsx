import "../styles/globals.css";
import Head from "next/head";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { useUser } from "../lib/hooks";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
const { ethers } = require("ethers");
import { Contract } from "@ethersproject/contracts";
import { firebaseApp } from "../lib/firebase";
import {
  fetchAndActivate,
  getValue,
  getRemoteConfig,
} from "firebase/remote-config";

import CreditsModal from "../components/credits-modal";
import Nav from "../components/nav";

// suppress console.log when in production
// if (process.env.NODE_ENV !== "development") {
//   console.log = () => {};
// }

declare var window: any; // to avoid typescript error on window.ethereum

export default function App({ Component, pageProps }: AppProps) {
  const [creditsModalTrigger, setCreditsModalTrigger] = useState(false);
  const user = useUser();

  const [creatorContract, setcreatorContract] = useState<Contract | null>(null);
  const [creditCost, setCreditCost] = useState<number | null>(null);
  const [creatorPassCost, setCreatorPassCost] = useState<number | null>(null);
  const [creatorCreditsPerMonth, setCreatorCreditsPerMonth] = useState<
    number | null
  >(null);
  const [creatorSubscriptionLength, setCreatorSubscriptionLength] = useState<
    number | null
  >(null);

  const getCreatorContract = async () => {
    // get contract address from firebase
    if (user.provider && user.networkName && creatorContract === null) {
      console.log("Getting creator contract");
      const docRef = doc(db, "contracts", user.networkName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.creator) {
          let { address, abi } = JSON.parse(data.creator);
          console.log("Connecting to creator contract:", address);
          console.log("ABI:", abi);
          const contract = new ethers.Contract(address, abi, user.provider);
          setcreatorContract(contract);
        } else {
          console.error(`No Creator contract deployed on: ${user.networkName}`);
        }
      } else {
        console.error(`No Creator contract deployed on: ${user.networkName}`);
      }
    }
  };

  // once have wallet and creator contract, run api/handleWalletConnect
  useEffect(() => {
    if (user.account && creatorContract) {
      user.checkIsCreator(creatorContract);
    }
  }, [user.account, creatorContract]);

  // get current network from moralis
  useEffect(() => {
    if (user.provider) {
      getCreatorContract();
    }
  }, [user.provider, user.networkName]);

  useEffect(() => {
    // get remote config
    const remoteConfig = getRemoteConfig(firebaseApp);
    fetchAndActivate(remoteConfig)
      .then(() => {
        // get credit cost
        const creditCost = getValue(remoteConfig, "credit_cost").asNumber();
        setCreditCost(creditCost);
        // get creator mint pass cost
        const creatorMintCost = getValue(
          remoteConfig,
          "creator_mint_cost"
        ).asNumber();
        setCreatorPassCost(creatorMintCost);
        // get creator credits per month
        const creatorCreditsPerMonth = getValue(
          remoteConfig,
          "creator_monthly_credits"
        ).asNumber();
        setCreatorCreditsPerMonth(creatorCreditsPerMonth);
        // get creator subscription length
        const creatorSubscriptionLength = getValue(
          remoteConfig,
          "creator_subscription_length"
        ).asNumber();
        setCreatorSubscriptionLength(creatorSubscriptionLength);
      })
      .catch((err) => {
        console.error(err);
      });

    // metamask listeners
    if (window.ethereum) {
      // add listener for window.ethereum metamask network change
      window.ethereum.on("chainChanged", () => {
        console.log("chainChanged");
        window.location.reload();
      });
      // add listener for metamask account change
      window.ethereum.on("accountsChanged", () => {
        console.log("accountsChanged");
        user.getAccount();
        // TODO log out moralis user
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Algovera Flow</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav user={user} setCreditsModalTrigger={setCreditsModalTrigger} />
      <CreditsModal
        user={user}
        creditsModalTrigger={creditsModalTrigger}
        setCreditsModalTrigger={setCreditsModalTrigger}
      />
      <Component
        {...pageProps}
        user={user}
        creatorContract={creatorContract}
        creditsModalTrigger={creditsModalTrigger}
        setCreditsModalTrigger={setCreditsModalTrigger}
        creditCost={creditCost}
        creatorPassCost={creatorPassCost}
        creatorCreditsPerMonth={creatorCreditsPerMonth}
        creatorSubscriptionLength={creatorSubscriptionLength}
      />
    </>
  );
}
