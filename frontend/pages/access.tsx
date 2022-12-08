import { useEffect, useState } from "react";
import type { NextPage } from "next";
import CreditsModal from "../components/credits-modal";
import Roadmap from "../components/roadmap";
import { PageProps } from "../lib/types";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "react-toastify";

const accessImg = require("../assets/access.png");

const TOKEN_ID = 0; // todo read from config

type SignatureInfo = {
  sig: string;
  price: number;
  tokenId: number;
};

const C: NextPage<PageProps> = ({
  user,
  accessContract,
  accessPassCost,
  accessCreditsPerMonth,
  accessSubscriptionLength,
}) => {
  const [status, setStatus] = useState<string | null>(null);
  const [openseaAssetUrl, setOpenseaAssetUrl] = useState<string | null>(null);
  const [signature, setSignature] = useState<SignatureInfo | null>(null);

  const features = [
    {
      name: "Credits",
      description: `${accessCreditsPerMonth} credits per month for ${accessSubscriptionLength} months`,
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
      description: "NFT-gated Discord channel, events and rewards",
    },
  ];

  const getSignature = async () => {
    if (user.networkName && user.account && accessContract?.address) {
      const sigDocRef = doc(
        db,
        "access_pass_signatures",
        user.networkName,
        accessContract.address,
        `token_${TOKEN_ID}`,
        "wallets",
        user.account
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

  const error = (msg: string) => {
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
    if (user.account && user.networkName && accessContract?.address) {
      getSignature();
    }
  }, [user.account, user.networkName, accessContract?.address]);

  const mint = async () => {
    const { signer, provider, account, networkName } = user;
    if (!signer || !provider || !account || !networkName) {
      error("Please connect your wallet");
      return;
    }
    if (!accessContract) {
      error("Access contract not found");
      return;
    }
    const mintingActive = await accessContract.mintingActive(TOKEN_ID);
    if (!mintingActive) {
      error("Access pass minting is not active");
      return;
    }
    const balance = await accessContract.balanceOf(account, TOKEN_ID);
    if (balance > 0) {
      error("You already have an access pass");
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
      mintPrice = await accessContract.tokenPrices(TOKEN_ID);
    } else {
      sig = signature.sig;
      mintPrice = signature.price;
    }

    console.log("Mint price:", mintPrice.toString());
    console.log("Signature:", sig);

    try {
      const methodSignature = await accessContract.interface.encodeFunctionData(
        "mint",
        [TOKEN_ID, sig] // TODO get real signatures for approved mints
      );

      const txnParams = {
        to: accessContract.address,
        value: 0, // all Community art mints are free
        data: methodSignature,
        from: account,
      };
      const gasEstimate = await signer.estimateGas(txnParams);
      console.log("Gas estimate:", gasEstimate.toString());

      // send transaction
      setStatus("Awaiting signature");
      const txn = await signer.sendTransaction({
        to: accessContract.address,
        value: 0, // all Community art mints are free
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
      if (networkName === "mainnet") {
        openseaUrl = "https://opensea.io/assets/";
      } else {
        openseaUrl = "https://testnets.opensea.io/assets/";
      }
      setOpenseaAssetUrl(
        openseaUrl + accessContract.address + "/" + TOKEN_ID.toString()
      );

      // mark user as access (to trigger checkAccessCredits)
      user.checkHasAccess(accessContract);
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
                Tired of buying credits? <br /> Make a one-time NFT purchase for{" "}
                {accessPassCost} ETH to get monthly credits and other perks.
              </p>
              <div className="mt-8 text-center justify-center">
                <div
                  onClick={mint}
                  className="block rounded-lg bg-gradient-to-r from-primary to-primary-lighter mx-auto px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm  hover:bg-primary-darker w-32 text-center cursor-pointer hover:brightness-90"
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
