import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";

import CreditsModal from "../components/credits-modal";
import FeedbackModal from "../components/feedback-modal";
import Nav from "../components/nav";
import { UserContext, Web3Context, AppContext } from "../lib/contexts";
import {
  WorkflowConfigType,
  WorkflowConfigsType,
  BlockConfigType,
  BlockConfigsType,
} from "../lib/types";

import { db } from "../lib/firebase";
import { firebaseApp } from "../lib/firebase";
import {
  fetchAndActivate,
  getValue,
  getRemoteConfig,
} from "firebase/remote-config";
import { Analytics } from "@vercel/analytics/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { BaseProvider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
const { ethers } = require("ethers");
import { ToastContainer, toast } from "react-toastify";
import { Contract } from "@ethersproject/contracts";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// suppress console.log when in production on main branch
const branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH;
if (branch === "main" && process.env.NODE_ENV === "production") {
  console.log = () => {};
} else {
  console.log("Logging enabled on branch:", process.env.GIT_BRANCH);
}

declare var window: any; // to avoid typescript error on window.ethereum

export default function App({ Component, pageProps }: AppProps) {
  // web3 context
  const [provider, setProvider] = useState<BaseProvider | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [accessContract, setAccessContract] = useState<Contract | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  const web3Context = {
    accessContract,
    provider,
    signer,
    networkName,
  };

  // user context
  const [uid, setUID] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  const userContext = {
    uid,
    walletAddress,
    credits,
    hasAccess,
  };

  // app context
  const [creditsModalTrigger, setCreditsModalTrigger] = useState<
    boolean | string
  >(false);
  const [feedbackModalTrigger, setFeedbackModalTrigger] = useState(false);
  const [creditCost, setCreditCost] = useState<number | null>(null);
  const [accessPassCost, setAccessPassCost] = useState<number | null>(null);
  const [accessCreditsPerMonth, setAccessCreditsPerMonth] = useState<
    number | null
  >(null);
  const [accessSubscriptionLength, setAccessSubscriptionLength] = useState<
    number | null
  >(null);
  const [stripeCreditsPerMonth, setStripeCreditsPerMonth] = useState<
    number | null
  >(null);

  const [workflowConfigs, setWorkflowConfigs] = useState<WorkflowConfigsType>(
    {}
  );
  const [blockConfigs, setBlockConfigs] = useState<BlockConfigsType>({});

  const appContext = {
    creditsModalTrigger,
    creditCost,
    accessPassCost,
    accessCreditsPerMonth,
    accessSubscriptionLength,
    stripeCreditsPerMonth,
    workflowConfigs,
    blockConfigs,
    setHasAccess,
    setCreditsModalTrigger,
    setFeedbackModalTrigger,
  };

  useEffect(() => {
    // on mount
    // this runs twice in dev because of reactStrictMode in next.config.js
    loadRemoteConfig();
    loadWorkflowConfigs();
    checkMetamaskConnection();
    setupMetamaskListeners();

    // check url params
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    if (status === "subscribed") {
      toast.success("Subscription successful!", {
        position: "bottom-left",
      });
    } else if (status === "subscription_canceled") {
      toast.success("Subscription canceled!", {
        position: "bottom-left",
      });
    } else if (status === "credits_purchased") {
      toast.success("Credits purchase successful!", {
        position: "bottom-left",
      });
    }
  }, []);

  useEffect(() => {
    // user login
    if (uid) {
      checkIfWeb3User();
      checkSubscription(); // (stripe)
      pollCredits();
    }
  }, [uid]);

  useEffect(() => {
    // web3 user login
    if (uid && walletAddress) {
      checkGiftedCredits();
    }
  }, [uid, walletAddress]);

  useEffect(() => {
    // web3 user login or network has changed
    if (walletAddress && provider) {
      checkWalletAddress();
      getAccessContract();
    }
  }, [walletAddress, provider, networkName]);

  useEffect(() => {
    // web3 user login and access contract found
    checkHasAccess();
  }, [walletAddress, accessContract]);

  useEffect(() => {
    // user login who holds an access pass
    if (uid && hasAccess) {
      checkAccessCredits();
    }
  }, [uid, hasAccess]);

  const loadWorkflowConfigs = async () => {
    // for workflows and blocks
    const workflowQuerySnapshot = await getDocs(
      collection(db, "workflow_configs")
    );
    const workflowConfigs: WorkflowConfigsType = {};
    workflowQuerySnapshot.docs.map((doc) => {
      workflowConfigs[doc.id] = doc.data();
    });
    console.log("workflowConfigs: ");
    setWorkflowConfigs(workflowConfigs);

    const blockQuerySnapshot = await getDocs(collection(db, "block_configs"));
    const blockConfigs: BlockConfigsType = {};
    blockQuerySnapshot.docs.map((doc) => {
      blockConfigs[doc.id] = doc.data();
    });
    setBlockConfigs(blockConfigs);
  };

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

  const getAccessContract = async () => {
    // get contract address from firebase
    if (provider && networkName && !accessContract) {
      console.log("Getting access contract");
      const docRef = doc(db, "contracts", networkName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.access) {
          let { address, abi } = JSON.parse(data.access);
          console.log("Connecting to access contract:", address);
          console.log("ABI:", abi);
          const accessContract = new ethers.Contract(address, abi, provider);
          setAccessContract(accessContract);
          console.log(
            "checking if user has an access pass",
            walletAddress,
            accessContract
          );
        } else {
          console.error(`No Access contract deployed on: ${networkName}`);
        }
      } else {
        console.error(`No Access contract deployed on: ${networkName}`);
      }
    }
  };

  const checkHasAccess = async () => {
    if (walletAddress && accessContract) {
      let hasAccess = false;
      const tokenIds = [0]; // todo update if launch more tokens
      for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i];
        console.log("checking balance", tokenId);
        const balance = await accessContract.balanceOf(walletAddress, tokenId);
        console.log("balance", balance);
        if (balance.gt(0)) {
          hasAccess = true;
          break;
        }
      }
      console.log("hasAccess: ", hasAccess);
      setHasAccess(hasAccess);
    }
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
        // get stripe credits per month
        const stripeCreditsPerMonth = getValue(
          remoteConfig,
          "subscription_monthly_credits"
        ).asNumber();
        setStripeCreditsPerMonth(stripeCreditsPerMonth);
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
        console.log("network changed - reloading");
        window.location.reload();
      });
      // add listener for metamask account change
      window.ethereum.on("accountsChanged", () => {
        console.log("metamask account changed - reloading");
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

  const checkSubscription = async () => {
    // call this when a user logs in
    console.log("checking subscription");
    const res = await fetch(
      // "http://127.0.0.1:5001/sdxcrypto-algovera/us-central1/checkSubscription",
      "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/checkSubscription",
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
      <AppContext.Provider value={appContext}>
        <UserContext.Provider value={userContext}>
          <Web3Context.Provider value={web3Context}>
            <Head>
              <title>Algovera Flow</title>
              <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
              />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <ToastContainer />
            <Nav
              setUID={setUID}
              setFeedbackModalTrigger={setFeedbackModalTrigger}
            />
            <CreditsModal
              uid={uid}
              credits={credits}
              creditsModalTrigger={creditsModalTrigger}
              setCreditsModalTrigger={setCreditsModalTrigger}
            />
            <FeedbackModal
              uid={uid || null}
              feedbackModalTrigger={feedbackModalTrigger}
              setFeedbackModalTrigger={setFeedbackModalTrigger}
            />
            <Component />
            <Analytics />
          </Web3Context.Provider>
        </UserContext.Provider>
      </AppContext.Provider>
    </UserProvider>
  );
}
