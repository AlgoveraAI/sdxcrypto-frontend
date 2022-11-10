import { useRef, useState } from "react";
import type { NextPage } from "next";
import Nav from "../components/nav";
import Hero from "../components/hero";
import HowItWorks from "../components/howitworks";
import Pricing from "../components/pricing";
import CreditsModal from "../components/credits-modal";
import { PageProps } from "../lib/types";

const Home: NextPage<PageProps> = ({
  uid,
  setUid,
  credits,
  setCredits,
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
        setCredits={setCredits}
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
