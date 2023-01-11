import { useEffect, useState, useContext } from "react";
import type { NextPage } from "next";
import Roadmap from "../components/roadmap";
import { PageProps } from "../lib/types";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "react-toastify";
const { ethers } = require("ethers");
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  UserContext,
  UserContextType,
  AppContext,
  AppContextType,
  Web3Context,
  Web3ContextType,
} from "../lib/contexts";

const accessImg = require("../assets/access.png");

const TOKEN_ID = 0; // todo read from config

type SignatureInfo = {
  sig: string;
  price: number;
  tokenId: number;
};

const C: NextPage<PageProps> = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [openseaAssetUrl, setOpenseaAssetUrl] = useState<string | null>(null);
  const [signature, setSignature] = useState<SignatureInfo | null>(null);

  const { user, error, isLoading } = useUser();

  const appContext = useContext(AppContext) as AppContextType;
  const userContext = useContext(UserContext) as UserContextType;
  const web3Context = useContext(Web3Context) as Web3ContextType;

  const features = [
    {
      name: "Credits",
      description: `${appContext.accessCreditsPerMonth} credits per month for ${appContext.accessSubscriptionLength} months`,
    },
    {
      name: "Priority support",
      description: "Get higher priority support from the core team",
    },
    {
      name: "Early Access",
      description: "Be the first to use new models and workflows",
    },
    {
      name: "Community",
      description: "Token-gated Discord channel, events and rewards",
    },
  ];

  const getSignature = async () => {
    if (
      web3Context.networkName &&
      userContext.walletAddress &&
      web3Context.accessContract?.address
    ) {
      const sigDocRef = doc(
        db,
        "access_pass_signatures",
        web3Context.networkName,
        web3Context.accessContract.address,
        `token_${TOKEN_ID}`,
        "wallets",
        userContext.walletAddress
      );
      const sigDocSnap = await getDoc(sigDocRef);
      if (sigDocSnap.exists()) {
        const data = sigDocSnap.data();
        if (data) {
          console.log("got signature", data);
          setSignature(data as SignatureInfo);
        }
      } else {
        console.log("no signature found");
        setSignature({
          sig: "0x",
          price: 0, // will get below during mint()
          tokenId: TOKEN_ID,
        });
      }
    }
  };

  const errorToast = (msg: string) => {
    toast(msg, {
      position: "bottom-left",
      type: "error",
      autoClose: 5000,
      theme: "dark",
      style: {
        fontSize: ".9rem",
      },
    });
  };

  // once we have user account and contract address, look for a signature
  useEffect(() => {
    if (
      userContext.walletAddress &&
      web3Context.networkName &&
      web3Context.accessContract?.address
    ) {
      getSignature();
    }
  }, [
    userContext.walletAddress,
    web3Context.networkName,
    web3Context.accessContract?.address,
  ]);

  const mint = async () => {
    console.log("minting to", web3Context.accessContract);
    if (
      !web3Context.signer ||
      !web3Context.provider ||
      !userContext.walletAddress ||
      !web3Context.networkName ||
      !userContext.uid
    ) {
      errorToast("Please connect your wallet to mint");
      return;
    }
    if (!web3Context.accessContract) {
      errorToast(
        "Access contract not found on network " + web3Context.networkName
      );
      return;
    }
    const mintingActive = await web3Context.accessContract.mintingActive(
      TOKEN_ID
    );
    if (!mintingActive) {
      errorToast("Access pass minting is not active");
      return;
    }
    const balance = await web3Context.accessContract.balanceOf(
      userContext.walletAddress,
      TOKEN_ID
    );
    if (balance > 0) {
      errorToast("You already have an access pass");
      return;
    }

    setStatus("Preparing transaction");

    if (signature === null) {
      // should not be null (getSignature is automatically triggered)
      // but if it is, run again before minting so we dont miss a signature
      await getSignature();
    }

    let sig, mintPrice;
    if (signature === null || signature.sig === "0x") {
      sig = "0x";
      mintPrice = await web3Context.accessContract.tokenPrices(TOKEN_ID);
    } else {
      sig = signature.sig;
      mintPrice = signature.price;
    }

    console.log("Mint price:", mintPrice.toString());
    console.log("Signature:", sig);

    try {
      const methodSignature =
        await web3Context.accessContract.interface.encodeFunctionData(
          "mint",
          [TOKEN_ID, sig] // TODO get real signatures for approved mints
        );

      const txnParams = {
        to: web3Context.accessContract.address,
        value: mintPrice, // all Community art mints are free
        data: methodSignature,
        from: userContext.walletAddress,
      };
      const gasEstimate = await web3Context.signer.estimateGas(txnParams);
      console.log("Gas estimate:", gasEstimate.toString());

      // send transaction
      setStatus("Awaiting signature");
      const txn = await web3Context.signer.sendTransaction({
        to: web3Context.accessContract.address,
        value: mintPrice, // all Community art mints are free
        data: methodSignature,
        gasLimit: gasEstimate,
      });
      console.log("Transaction:", txn);

      // wait for transaction to be mined
      setStatus("Transaction executing");
      const receipt = await txn.wait();
      console.log("Receipt:", receipt);
      setStatus("Mint successful!");

      // get opensea url
      let openseaUrl = "";
      if (
        web3Context.networkName === "mainnet" ||
        web3Context.networkName === "homestead"
      ) {
        openseaUrl = "https://opensea.io/assets/";
      } else {
        openseaUrl = "https://testnets.opensea.io/assets/";
      }
      setOpenseaAssetUrl(
        openseaUrl +
          web3Context.accessContract.address +
          "/" +
          TOKEN_ID.toString()
      );

      // mark user as access (to trigger checkAccessCredits)
      appContext.setHasAccess(true);
    } catch (error: any) {
      if (error.message?.includes("user rejected transaction")) {
        console.error("User rejected transaction");
        setStatus(null);
      } else {
        console.error(error);
      }
      setStatus(null);
    }
  };

  return (
    <div>
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-5xl pt-12 pb-32 sm:pt-24 sm:pb-40">
          <div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-center sm:text-6xl">
                Algovera Access Pass
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-400 text-center w-3/4 mx-auto">
                Tired of buying credits? <br /> Make a one-time purchase for{" "}
                {appContext.accessPassCost} ETH to get monthly credits and other
                perks.
              </p>
              <div className="mt-8 text-center justify-center">
                <div
                  onClick={mint}
                  className="primary-button block rounded-lg mx-auto px-4 py-1.5 text-base font-semibold leading-7 shadow-sm w-32 text-center cursor-pointer"
                >
                  Mint
                </div>
                {status ? (
                  <div>
                    <p className="mt-2 text-sm text-gray-500">{status}</p>
                    <p className="mt-0 text-sm text-gray-500">
                      {openseaAssetUrl ? (
                        <a
                          className="underline"
                          href={openseaAssetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on OpenSea
                        </a>
                      ) : (
                        <span>{"Please keep the page open"}</span>
                      )}
                    </p>
                  </div>
                ) : signature?.price === 0 && signature?.sig != "0x" ? (
                  <span className="mt-2 text-sm text-gray-500">
                    {"You can mint for free!"}
                  </span>
                ) : null}
              </div>
            </div>
            <Image
              className="mt-12 max-h-256 w-auto mx-auto max-w-512"
              src={accessImg}
              alt="NFT Image"
              width={512}
              height={512}
            />
            {/* <p className="mt-2 text-sm leading-8 text-gray-500 text-center w-3/4 mx-auto">
              Art generated by @Arshy using the Algovera AI Platform
            </p> */}
          </div>
          <div className="overflow-hidden text-white pt-24">
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl">
              Perks
            </h2>
            <div className="relative mx-auto max-w-7xl sm:pt-6 pt-0 px-4 sm:px-6 lg:px-8">
              <div className="relative lg:grid lg:grid-cols-1 lg:gap-x-8">
                <dl className="mt-10 space-y-10 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 sm:space-y-0 lg:col-span-2 lg:mt-0  text-center">
                  {features.map((feature) => (
                    <div key={feature.name}>
                      <dt>
                        <p className="mt-5 text-2xl font-medium leading-6 text-gray-50">
                          {feature.name}
                        </p>
                      </dt>
                      <dd className="mt-2 text-lg text-gray-400">
                        {feature.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
          <Roadmap />
        </div>
      </div>
    </div>
  );
};

export default C;
