import "../styles/globals.css";
import Head from "next/head";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { useUser } from "../lib/hooks";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
const { ethers } = require("ethers");
import { Contract } from "@ethersproject/contracts";

// suppress console.log when in production
// if (process.env.NODE_ENV !== "development") {
//   console.log = () => {};
// }

export default function App({ Component, pageProps }: AppProps) {
  const [creditsModalTrigger, setCreditsModalTrigger] = useState(false);
  const user = useUser();

  const [creatorContract, setcreatorContract] = useState<Contract | null>(null);

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
    } else {
      console.error("Not connected to metamask");
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

  return (
    <>
      <Head>
        <title>Algovera Flow</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component
        {...pageProps}
        user={user}
        creatorContract={creatorContract}
        creditsModalTrigger={creditsModalTrigger}
        setCreditsModalTrigger={setCreditsModalTrigger}
      />
    </>
  );
}
