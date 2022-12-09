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

// suppress console.log when in production on main branch
const branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH;
if (branch === "main" && process.env.NODE_ENV === "production") {
  console.log = () => {};
} else {
  console.log("Logging enabled on branch:", process.env.GIT_BRANCH);
}

declare var window: any; // to avoid typescript error on window.ethereum

export default function App({ Component, pageProps }: AppProps) {
  const [creditsModalTrigger, setCreditsModalTrigger] = useState(false);

  const [creditCost, setCreditCost] = useState<number | null>(null);
  const [accessPassCost, setAccessPassCost] = useState<number | null>(null);
  const [accessCreditsPerMonth, setAccessCreditsPerMonth] = useState<
    number | null
  >(null);
  const [accessSubscriptionLength, setAccessSubscriptionLength] = useState<
    number | null
  >(null);

  useEffect(() => {
    const remoteConfig = getRemoteConfig(firebaseApp);
    remoteConfig.settings.minimumFetchIntervalMillis = 0; // always fetch latest
    fetchAndActivate(remoteConfig)
      .then(() => {
        // get credit cost
        const creditCost = getValue(remoteConfig, "credit_cost").asNumber();
        console.log("creditCost:", creditCost);
        setCreditCost(creditCost);
        // get access mint pass cost
        const accessMintCost = getValue(
          remoteConfig,
          "access_mint_cost"
        ).asNumber();
        console.log("accessMintCost:", accessMintCost);
        setAccessPassCost(accessMintCost);
        // get access credits per month
        const accessCreditsPerMonth = getValue(
          remoteConfig,
          "access_monthly_credits"
        ).asNumber();
        console.log("accessCreditsPerMonth:", accessCreditsPerMonth);
        setAccessCreditsPerMonth(accessCreditsPerMonth);
        // get access subscription length
        const accessSubscriptionLength = getValue(
          remoteConfig,
          "access_subscription_length"
        ).asNumber();
        console.log("accessSubscriptionLength:", accessSubscriptionLength);
        setAccessSubscriptionLength(accessSubscriptionLength);
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
        window.location.reload();
      });
    }
  }, []);

  return (
    <UserProvider>
      <Head>
        <title>Algovera Flow</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav setCreditsModalTrigger={setCreditsModalTrigger} />
      {/* <CreditsModal
        creditsModalTrigger={creditsModalTrigger}
        setCreditsModalTrigger={setCreditsModalTrigger}
      /> */}
      <ToastContainer />
      <Component
        {...pageProps}
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
