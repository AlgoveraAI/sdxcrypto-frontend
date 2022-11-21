import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Nav from "../components/nav";
import CreditsModal from "../components/credits-modal";
import { PageProps } from "../lib/types";
import Image from "next/image";
const { ethers } = require("ethers");

const accessImg = require("../assets/access.png");

const features = [
  {
    name: "Credits",
    description: "Get 200 free credits per month",
  },
  {
    name: "Minting",
    description: "Mint your AI art as an NFT for free",
  },
  {
    name: "Early Access",
    description: "Be the first to use new models",
  },
  {
    name: "Community",
    description: "Access a holders-only Discord channel",
  },
];

const TOKEN_ID = 0; // todo configure this in db

const C: NextPage<PageProps> = ({
  user,
  creatorContract,
  creditsModalTrigger,
  setCreditsModalTrigger,
}) => {
  const mint = async () => {
    // todo: check for signature for free mints
    const { signer, provider, account, networkName } = user;
    if (!signer || !provider || !account || !networkName) {
      alert("Not connected to metamask");
      return;
    }

    if (!creatorContract) {
      alert("No contract found");
      return;
    }
    const mintingActive = await creatorContract.mintingActive(TOKEN_ID);
    if (!mintingActive) {
      alert("Minting is not active");
      return;
    }
    const balance = await creatorContract.balanceOf(account);
    if (balance > 0) {
      alert("You can only mint 1 Creator Pass per wallet");
      return;
    }
    const mintPrice = await creatorContract.tokenPrices(TOKEN_ID);
    console.log("Mint price:", mintPrice.toString());
    const txn = await creatorContract.mint(TOKEN_ID, "0x", {
      value: mintPrice,
    });
    console.log("Mint txn:", txn);
  };

  return (
    <div>
      <CreditsModal
        user={user}
        creditsModalTrigger={creditsModalTrigger}
        setCreditsModalTrigger={setCreditsModalTrigger}
      />
      <Nav user={user} setCreditsModalTrigger={setCreditsModalTrigger} />
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-3xl pt-12 pb-32 sm:pt-24 sm:pb-40">
          <div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-center sm:text-6xl">
                Premium Creator Pass
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-400 text-center w-3/4 mx-auto">
                Tired of buying credits? <br /> Make a one-time NFT purchase for
                0.05 ETH to get monthly credits and other perks.
              </p>
              <div className="mt-8 text-center justify-center">
                <div
                  onClick={mint}
                  className="block rounded-lg bg-primary mx-auto px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm  hover:bg-primary-darker w-32 text-center cursor-pointer"
                >
                  Mint
                </div>
              </div>
            </div>
            <Image
              className="mt-12 max-h-256 w-auto mx-auto"
              src={accessImg}
              alt="NFT Image"
            />
            <p className="mt-2 text-sm leading-8 text-gray-500 text-center w-3/4 mx-auto">
              Art generated by @Arshy using the Algovera AI Platform
            </p>
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
        </div>
      </div>
    </div>
  );
};

export default C;
