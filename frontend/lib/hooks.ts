import {
  getMoralisAuth,
  MoralisAuth,
} from "@moralisweb3/client-firebase-auth-utils";
import { firebaseApp, auth } from "./firebase";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BaseProvider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
import { signInWithMoralis } from "@moralisweb3/client-firebase-evm-auth";
const { ethers } = require("ethers");
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Contract } from "@ethersproject/contracts";
import { toast } from "react-toastify";

declare var window: any; // to avoid typescript error on window.ethereum

export const useMoralisAuth = () => {
  const [user] = useAuthState(auth);
  const [moralisAuth, setMoralisAuth] = useState<MoralisAuth | null>(null);
  const login = async () => {
    setMoralisAuth(getMoralisAuth(firebaseApp));
  };
  useEffect(() => {
    login();
  }, []);
  return moralisAuth;
};

// TODO switch user to a class?
export interface User {
  uid: string | null;
  provider: BaseProvider | null;
  signer: Signer | null;
  account: string | null;
  networkName: string | null;
  moralisAuth: MoralisAuth | null;
  credits: number | null;
  loading: boolean;
  hasAccess: boolean | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  setCredits: React.Dispatch<React.SetStateAction<number | null>>;
  getAccount: () => Promise<void>;
  checkHasAccess: (contract: Contract) => Promise<void>;
}

export const useUser = () => {
  // a user has both a firebase UID
  // and a metamask wallet address (account)
  // if metamask is locked, firebase will still authenticate
  // and the user can buy credits and generate images
  // to mint, metamask must be unlocked (signer and account will be null)

  const [uid, setUid] = useState<string | null>(null);
  const [provider, setProvider] = useState<BaseProvider | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const moralisAuth = useMoralisAuth();

  const getAccount = async () => {
    if (window.ethereum) {
      // get injected provider from metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      console.log("network: ", network.name);
      setNetworkName(network.name);
      setProvider(provider);
      // now check if there is a connected account and set the account (signer)
      try {
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        console.log("account: ", account);
        setAccount(account);
        setSigner(signer);
      } catch (error) {
        console.error("could not get MetaMask account");
      }
    } else {
      console.error("MetaMask not installed");
    }
  };

  useEffect(() => {
    // if moralisAuth connects, check for metamask wallet
    // (metamask might not be logged in, in which case dont display the user)
    if (moralisAuth?.auth.currentUser) {
      const { uid } = moralisAuth.auth.currentUser;
      console.log("got UID", uid);
      setUid(uid);
      setLoading(false);
      console.log("checking MetaMask");
      getAccount();
    }
  }, [moralisAuth?.auth.currentUser]);

  useEffect(() => {
    // set app to poll credits if uid is found
    // triggers when user logs in or out
    if (uid) {
      console.log("initiating credits poll:", uid);

      const checkCredits = async () => {
        const docRef = doc(db, "users", uid);
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            setCredits(docSnap.data().credits);
          } else {
            console.log("User not in firestore db", uid);
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
  }, [uid]);

  const checkGiftedCredits = async () => {
    console.log("checking gifted credits");
    const res = await fetch(
      // "http://127.0.0.1:5001/sdxcrypto-algovera/us-central1/checkGiftedCredits",
      "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/checkGiftedCredits",
      {
        method: "POST",
        body: JSON.stringify({
          uid: uid,
          walletAddress: account,
        }),
      }
    );
    if (!res.ok) {
      console.error("error checking gifted credits", res);
    }
  };

  const checkAccessCredits = async () => {
    console.log("checking access credits");
    const res = await fetch(
      // "http://127.0.0.1:5001/sdxcrypto-algovera/us-central1/checkAccessCredits",
      "https://us-central1-sdxcrypto-algovera.cloudfunctions.net/checkAccessCredits",
      {
        method: "POST",
        body: JSON.stringify({
          uid: uid,
          walletAddress: account,
          hasAccess: hasAccess,
        }),
      }
    );
    if (!res.ok) {
      console.error("error checking access credits", res);
    }
  };

  useEffect(() => {
    if (uid && account) {
      checkGiftedCredits();
    }
  }, [uid, account]);

  return {
    uid,
    provider,
    signer,
    account,
    networkName,
    moralisAuth,
    credits,
    loading,
    setCredits,
    getAccount,
  };
};
