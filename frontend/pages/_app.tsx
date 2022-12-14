import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import Head from "next/head";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
// import { useUser } from "../lib/hooks";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { firebaseApp } from "../lib/firebase";
import {
  fetchAndActivate,
  getValue,
  getRemoteConfig,
  RemoteConfigSettings,
} from "firebase/remote-config";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";
import CreditsModal from "../components/credits-modal";
import Nav from "../components/nav";
import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { BaseProvider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
const { ethers } = require("ethers");
import { toast } from "react-toastify";

// suppress console.log when in production on main branch
const branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH;
if (branch === "main" && process.env.NODE_ENV === "production") {
  console.log = () => {};
} else {
  console.log("Logging enabled on branch:", process.env.GIT_BRANCH);
}

declare var window: any; // to avoid typescript error on window.ethereum

export default function App({ Component, pageProps }: AppProps) {
  // app controls
  const [creditsModalTrigger, setCreditsModalTrigger] = useState<
    boolean | string
  >(false);

  // config variables
  const [creditCost, setCreditCost] = useState<number | null>(null);
  const [accessPassCost, setAccessPassCost] = useState<number | null>(null);
  const [accessCreditsPerMonth, setAccessCreditsPerMonth] = useState<
    number | null
  >(null);
  const [accessSubscriptionLength, setAccessSubscriptionLength] = useState<
    number | null
  >(null);

  // user variables
  const [uid, setUID] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  // web3 stuff
  const [provider, setProvider] = useState<BaseProvider | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);

  useEffect(() => {
    // on mount
    loadRemoteConfig();
    checkMetamaskConnection();
    setupMetamaskListeners();

    // inject a function into the window to log state
    // useful for debugging
    window.logState = () => {
      console.log("state:", {
        creditsModalTrigger,
        creditCost,
        accessPassCost,
        accessCreditsPerMonth,
        accessSubscriptionLength,
        uid,
        walletAddress,
        hasAccess,
        credits,
        provider,
        networkName,
        signer,
      });
    };
  }, []);

  useEffect(() => {
    // on user login
    if (uid) {
      checkIfWeb3User();
      // checkGiftedCredits();
      pollCredits();
    }
  }, [uid]);

  useEffect(() => {
    // on user login and access pass check
    if (uid && hasAccess) {
      // checkAccessCredits();
    }
  }, [uid, hasAccess]);

  useEffect(() => {
    // web3 user signed in
    if (walletAddress && provider) {
      checkWalletAddress();
    }
  }, [walletAddress, provider]);

  const checkIfWeb3User = async () => {
    // runs once a user has logged in
    // checks if they used metamask to log in
    // if so, sets walletAddress
    if (uid?.includes("|siwe|")) {
      // get wallet address from uid
      let walletAddress = uid.split("|siwe|")[1];
      walletAddress = walletAddress.replace("eip155%3A1%3A", "");
      console.log("walletAddress from uid:", walletAddress);
      setWalletAddress(walletAddress);
    }
  };

  const checkWalletAddress = async () => {
    // if uid has a walletAddress and metamask is connected
    // check that the address we pulled from uid matches the address in metamask
    // (it wont if the user has switched account)
    if (signer && walletAddress) {
      try {
        const signerAddress = await signer?.getAddress();
        if (signerAddress !== walletAddress) {
          // raise a warning toast that metamask is connected to a different address
          console.error(
            `signer address (${signerAddress}) does not match UID wallet address (${walletAddress})`
          );
          toast.warning(
            "Metamask is connected to a different address than the one you used to log in. Please switch to the correct address or log in again.",
            {
              position: "bottom-left",
            }
          );
        }
        console.log("signer address matches wallet address");
      } catch (e) {
        console.log("requesting metamask connection to walletAddress");
        // trigger metamask connection to walletAddress
        // and tell user why we're doing it
        toast(
          `Please connect Metamask to the wallet you signed in with (${walletAddress})`,
          {
            position: "bottom-left",
            autoClose: 5000,
            theme: "dark",
            style: {
              fontSize: ".9rem",
            },
          }
        );
        await window.ethereum.request({
          method: "eth_requestAccounts",
          eth_accounts: {
            params: [walletAddress],
          },
        });
      }
    }
  };

  const checkMetamaskConnection = async () => {
    // look for metamask - runs on component mount
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();
    setNetworkName(network.name);
    console.log("got provider on network", network.name);
    const signer = provider.getSigner();
    setSigner(signer);
  };

  const loadRemoteConfig = async () => {
    // load variables from firebase's remote config
    const remoteConfig = getRemoteConfig(firebaseApp);
    remoteConfig.settings.minimumFetchIntervalMillis = 0; // always fetch latest
    fetchAndActivate(remoteConfig)
      .then(() => {
        // get credit cost
        const creditCost = getValue(remoteConfig, "credit_cost").asNumber();
        setCreditCost(creditCost);
        // get access mint pass cost
        const accessMintCost = getValue(
          remoteConfig,
          "access_mint_cost"
        ).asNumber();
        setAccessPassCost(accessMintCost);
        // get access credits per month
        const accessCreditsPerMonth = getValue(
          remoteConfig,
          "access_monthly_credits"
        ).asNumber();
        setAccessCreditsPerMonth(accessCreditsPerMonth);
        // get access subscription length
        const accessSubscriptionLength = getValue(
          remoteConfig,
          "access_subscription_length"
        ).asNumber();
        setAccessSubscriptionLength(accessSubscriptionLength);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const setupMetamaskListeners = () => {
    // add listeners for metamask network and account changes
    if (window.ethereum) {
      // add listener for window.ethereum metamask network change
      window.ethereum.on("chainChanged", () => {
        console.log("chainChanged");
        window.location.reload();
      });
      // add listener for metamask account change
      window.ethereum.on("accountsChanged", () => {
        console.log("accountsChanged");
        window.location.reload();
      });
    }
  };

  const checkGiftedCredits = async () => {
    // use this when any user logs in to see if they've been gifted credits
    // (it updates the user's credits in the db, which will be read in by the credits modal)
    console.log("checking gifted credits");
    const res = await fetch(
      // "http://127.0.0.1:5001/sdxcrypto-algovera/us-central1/checkGiftedCredits",
      "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/checkGiftedCredits",
      {
        method: "POST",
        body: JSON.stringify({
          uid: uid,
          walletAddress: walletAddress,
        }),
      }
    );
    if (!res.ok) {
      console.error("error checking gifted credits", res);
    }
  };

  const checkAccessCredits = async () => {
    // call this when a user logs in who holds an Access Pass
    console.log("checking access credits");
    const res = await fetch(
      // "http://127.0.0.1:5001/sdxcrypto-algovera/us-central1/checkAccessCredits",
      "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/checkAccessCredits",
      {
        method: "POST",
        body: JSON.stringify({
          uid: uid,
          walletAddress: walletAddress,
          hasAccess: hasAccess,
        }),
      }
    );
    if (!res.ok) {
      console.error("error checking access credits", res);
    }
  };

  const pollCredits = async () => {
    if (uid) {
      console.log("initiating credits poll:", uid);
      const checkCredits = async () => {
        const docRef = doc(db, "users", uid);
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            setCredits(docSnap.data().credits);
          } else {
            // user not in firestore
          }
        });
      };

      checkCredits();
      const interval = setInterval(async () => {
        checkCredits();
      }, 10000);
      return () => clearInterval(interval);
    } else {
      setCredits(null);
    }
  };

  return (
    <UserProvider>
      <Head>
        <title>Algovera Flow</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer />
      <Nav setUID={setUID} />
      <CreditsModal
        uid={uid}
        credits={credits}
        creditsModalTrigger={creditsModalTrigger}
        setCreditsModalTrigger={setCreditsModalTrigger}
      />
      <Component
        // {...pageProps}
        uid={uid}
        credits={credits}
        creditsModalTrigger={creditsModalTrigger}
        setCreditsModalTrigger={setCreditsModalTrigger}
        creditCost={creditCost}
        accessPassCost={accessPassCost}
        accessCreditsPerMonth={accessCreditsPerMonth}
        accessSubscriptionLength={accessSubscriptionLength}
      />
      <Analytics />
    </UserProvider>
  );
}
