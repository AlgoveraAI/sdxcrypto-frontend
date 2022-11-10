import { useRef, useState } from "react";
import type { NextPage } from "next";
import Nav from "../components/nav";
import Hero from "../components/index/hero";
import HowItWorks from "../components/index/howitworks";
import Pricing from "../components/index/pricing";
import CreditsModal from "../components/credits-modal";
import { PageProps } from "../lib/types";

const Home: NextPage<PageProps> = ({
  uid,
  setUid,
  credits,
  moralisAuth,
  creditsModalTrigger,
  setCreditsModalTrigger,
}) => {
  const howitworksRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <CreditsModal
        credits={credits}
        creditsModalTrigger={creditsModalTrigger}
        setCreditsModalTrigger={setCreditsModalTrigger}
        uid={uid}
      />
      <Nav
        uid={uid}
        setUid={setUid}
        credits={credits}
        moralisAuth={moralisAuth}
        setCreditsModalTrigger={setCreditsModalTrigger}
      />
      <Hero />
      <HowItWorks howitworksRef={howitworksRef} />
      <Pricing
        creditsModalTrigger={creditsModalTrigger}
        setCreditsModalTrigger={setCreditsModalTrigger}
      />
    </div>
  );
};

export default Home;
