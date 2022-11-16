import { useRef, useState } from "react";
import type { NextPage } from "next";
import Nav from "../components/nav";
import CreditsModal from "../components/credits-modal";
import { PageProps } from "../lib/types";
import Image from "next/image";
import {
  BoltIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";

const accessImg = require("../assets/access.png");

const features = [
  {
    name: "Credits",
    description: "Get 200 free credits per month",
    icon: GlobeAltIcon,
  },
  {
    name: "Minting",
    description: "Mint your AI artworks for free",
    icon: ScaleIcon,
  },
  {
    name: "Early Access",
    description: "Be the first to use new models",
    icon: BoltIcon,
  },
  {
    name: "Community",
    description: "Access a holders-only Discord channel",
    icon: EnvelopeIcon,
  },
];

const Pass: NextPage<PageProps> = ({
  user,
  creditsModalTrigger,
  setCreditsModalTrigger,
}) => {
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
                Premium Access Pass
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-500 text-center w-3/4 mx-auto">
                Tired of buying credits? <br /> Make a one-time NFT purchase to
                get monthly credits and other perks.
              </p>
              <div className="mt-8 flex gap-x-4 justify-center">
                <a
                  href="#"
                  className="inline-block rounded-lg bg-primary px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm  hover:bg-primary-darker w-32 text-center"
                >
                  Buy
                </a>
              </div>
            </div>
            <Image
              className="mt-12 max-h-256 w-auto mx-auto"
              src={accessImg}
              alt="NFT Image"
            />
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
                        <p className="mt-5 text-lg font-medium leading-6 text-gray-50">
                          {feature.name}
                        </p>
                      </dt>
                      <dd className="mt-2 text-base text-gray-500">
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

export default Pass;
